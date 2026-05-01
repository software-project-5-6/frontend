import { responsiveFontSizes } from "@mui/material";
import api from "./axiosConfig";


/**
 * ask something about a project
 * @param {Object} askObject // {projectId,conversationId,question}
 * @returns {Promise} API response
 */
export const askProject = async (askObject) => {
  try {
    console.log(askObject)
    const response = await api.post(`/chat/ask`, askObject);
    return response.data;
  } catch (error) {
    console.error("Error with quering project:", error);
    throw error;
  }
}
 
/**
 * this intialize new conversation and return cinversationId
 * @param {object} newConvesationObject // {projectId,title}
 */
 export const createConversation =async (newConvesationObject)=>{
  try{
    const response =await api.post(`/chat/conversation`,newConvesationObject);
    return response.data;
  }catch(error){
    console.error("Error with creating new conversation:", error);
    throw error;
  }
  
 } 

 export const getAllConversationsForProject = async (projectId)=>{
  try{
    const response = await api.get(`/chat/conversations/${projectId}`);
    return response.data;

  }catch(error){
     console.error("Error with getting project conversations:", error);
    throw error;

  }
 }

  export const getAllMessagesForConversation = async (conversationId)=>{
    try{
      const response = await api.get(`/chat/conversation/${conversationId}`);
      return response.data;

  }catch(error){
     console.error("Error with getting messages for conversation:", error);
    throw error;

  }}
  
   export const deleteAllMessagesForConversation = async (conversationId)=>{
    try{
      const response = await api.delete(`/chat/conversation/${conversationId}`);
      return response.data;

  }catch(error){
     console.error("Error with deleting messages for conversation:", error);
    throw error;

  }

 }