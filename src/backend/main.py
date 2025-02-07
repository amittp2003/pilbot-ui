from fastapi import FastAPI, Request, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from huggingface_hub import InferenceClient
import faiss
import pickle
import os
from dotenv import load_dotenv
import mail
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_community.vectorstores import FAISS
from langchain import LLMChain
from langchain_community.utilities import GoogleSearchAPIWrapper
from langchain.tools import Tool
from langchain.agents import initialize_agent
from langchain_huggingface import HuggingFaceEndpoint

# Load the pre-trained index and vector store
index = faiss.read_index("index_PCE.index")
with open("faiss_PCE.pkl", "rb") as fp:
    store = pickle.load(fp)
store.index = index

nav_index = faiss.read_index("index_nav.index")
with open("faiss_nav.pkl", "rb") as f:
    nav_store = pickle.load(f)
nav_store.index = nav_index

load_dotenv()

# Hugging Face Configuration
HF_TOKEN = os.getenv('HF_TOKEN')


# Templates
# TEMPLATE = """
# You are a chatbot assistant for Pillai College of Engineering, designed to provide information about student services and college-related inquiries. 
# UNDERSTAND THE USER QUERY AND RESPOND ACCORDINGLY. USER MAY GREET SOMETIME LIKE 'HELLO', 'HEY HI'. EVERYTIME IT IS NOT NECESSARY TO REFER THE RETRIVED DOCS TO RESPOND THE QUERY.

# Guidelines:
# 1. **If unsure**: Respond with, "Sorry, I'm not sure about the answer. Please visit the website for further assistance."
# 2. **No fabricated answers**: Avoid making up responses; only provide verified information.
# 3. **Clarifying unclear queries**: If the user's question is unclear, kindly ask for clarification or additional context.

# **Examples**
# Human: Hello
# Chatbot: Hello! How may I assist you today?

# Human: what's the weather today?
# Chatbot: Sorry for the inconvience, but I can help you with information regarding the PCE.


# ---------
# {summaries}
# ---------
# Human: {question}
# Chatbot: 
# """

TEMPLATE = '''
You are a chatbot assistant for Pillai College of Engineering, designed to provide information about student services and college-related inquiries.

Guidelines:
1. If unsure: Respond with "Sorry, I'm not sure about the answer. Please visit the website for further assistance."
2. No fabricated answers: Only provide verified information from the given context
3. For unclear queries: Ask for clarification

Context: {summaries}
Question: {question}


Examples:
Human: Hello
Chatbot: Hi! How can I assist you with PCE-related information today?

Remember to:
- Keep responses concise and relevant to the query
- Don't dump all available information at once
- Match the formality level of the user's query
'''
# Intent and Reframe Templates
INTENT_TEMPLATE = '''
Classify the intent of the user query as "Broad" if it is a general request or "Specific" if it asks for detailed information or "Mail" if it asks to mail the information.

Query: "{user_query}"

Intent:
'''

REFRAME_TEMPLATE = '''
You are an AI tasked with reframing questions for clarity and conciseness.

**Example**
QUESTION: Heyy
REFRAMED QUESTION: Hey 

QUESTION: computer engineering
REFRAMED QUESTION: give me syllabus of computer engineering

User Question: {user_question}
Reframed Question:
'''
# Nav_prompt='''
# You are an AI assitant that answers to questions asked regarding CAMPUS NAVIGATION ONLY!!. You are developed to assist with navigation in PCE campus. When user query is about welcome respond accordingly. IF THE CONTEXT RELATED TO THE QUERY IS NOT SUFFICIENT SIMPLY SAY "Sorry for inconvience Iam not able answer your query!!"  

Nav_prompt = '''
You are a helpful navigation assistant that answers to questions asked regarding CAMPUS NAVIGATION ONLY!!. You are developed to assist with navigation in PCE campus. Using the provided context about rooms and locations, 
give clear, step-by-step directions. Whenever the query is about navigation format your response in this structure else respond accordingly:

Current Location: [Extract or infer current location from context Else guide from Reception]
Destination: [Destination being asked about]
Route:
1. [First step]
2. [Second step]
...

Nearby Facilities [to Destination]:
- [List relevant nearby rooms/facilities]

Context: {summaries}
Question: {question}

Remember to:
- Say Sorry If no appropriate context is available
- Keep directions concise and clear
- Mention room numbers when available
- Include relevant landmarks
- List nearby facilities at the end

Answer:'''

# Utility Functions
# def generate_prompt(question, retrieved_docs, prmt_TEM):
#     doc_summaries = "\n".join([f"CONTENT: {doc.page_content}" for doc in retrieved_docs])
#     prompt = prmt_TEM.format(question=question, summaries=doc_summaries)
#     return prompt

def query_llama(question,  doc_summaries, prmt_TEM, repo_id='mistralai/Mistral-7B-Instruct-v0.3'):
    # llm=HuggingFaceEndpoint(repo_id=repo_id,)

    # prompt=PromptTemplate(input_variables=["summaries", "question"], template=prmt_TEM)
    # chain = prompt | llm | StrOutputParser()
    # resp= chain.invoke({"summaries": summaries, "question":question})
    
    # llm_chain=LLMChain(llm, prompt)
    # response=llm.invoke(prompt)
    # response=llm_chain.run()
    
    prompt = prmt_TEM.format(question=question, summaries=doc_summaries)
    client = InferenceClient(repo_id, token=HF_TOKEN)
    response = client.chat_completion(
        messages=[{"role": "user", "content": prompt}],
        max_tokens=500,
        stream=False
    )
    return response['choices'][0]['message']['content']
    # return resp


def query_with_template_and_sources(question, vectorstore, prmt_TEM):
    docs = vectorstore.similarity_search(question, k=2)
    doc_summaries = "\n".join([f"CONTENT: {doc.page_content}" for doc in docs])
    # prompt = generate_prompt(question, docs, prmt_TEM)
    answer = query_llama(question, doc_summaries, prmt_TEM)
    return answer

def query_with_template_and_sources_NAV(question, vectorstore, prmt_TEM):
    doc_summaries = vectorstore.similarity_search(question, k=2)
    # doc_summaries = "\n".join([f"CONTENT: {doc.page_content}" for doc in docs])
    # prompt = generate_prompt(question, docs, prmt_TEM)
    answer = query_llama(question, doc_summaries, prmt_TEM)
    return answer

# FastAPI Application
app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Model for Request
class ChatRequest(BaseModel):
    message: str
    user_name: str = ""
    email: str = ""

class Message(BaseModel):
    text: str
    sender: str
    topic: str

@app.post("/chat/general")
async def chat(request: ChatRequest):
    try:
        # Determine Intent
        # intent = query_llama(
        #     INTENT_TEMPLATE.format(user_query=request.message)
        # )
        # print(intent)

        # # Reframe Question
        # reframed_question = query_llama(
        #     REFRAME_TEMPLATE.format(user_question=request.message)
        # )
        # print(reframed_question)

        # Generate Response
        response = query_with_template_and_sources(request.message, store, TEMPLATE)

        # Optional: Send Email if Intent is Mail
        # if intent.strip().lower() == "mail":
        #     # Assuming you'll import or define the mail sending function
        #     import mail
        #     mail.sendEmail(request.email, request.user_name, response)

        return {
            "reply": response,
            # "intent": intent
        }
    
    except Exception as e:
        return {
            "reply": f"An error occurred: {str(e)}",
            "intent": "Error"
        }
    
@app.post("/chat/academics")
def handle_academics_query(request: ChatRequest):
    # Academics-specific logic
    print(request.message)
    return {"reply": request.message}

@app.post("/chat/campus-nav")
def handle_campus_life_query(request: ChatRequest):
    # Campus life specific logic
    
    try:
        if nav_store is None:
            raise Exception("Navigation store not initialized")


        nav_response=query_with_template_and_sources_NAV(request.message, nav_store, Nav_prompt)
        # print(nav_response)

        return {"reply": nav_response}
    
    except Exception as e:
        return {
            "reply": f"An error occurred: {str(e)}",
            "intent": "Error"
        }

@app.post("/chat/admissions")
def handle_admissions_query(message: str):
    # Admissions-specific logic
    return {"reply": "Admissions-related response"}

@app.post('/chat/mail')
def handle_sending_mail(message: Message, email: str = Body(...)):
    user= email.split('@')[0]
    print("Iam here", message.text,email)
    mail.sendEmail(email, user, message.text)

    return {'reply': "Mail sent"}
