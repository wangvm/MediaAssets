import request from "./request"

const $api = {
    login:(username,password)=>request('/login',{username,password},'POST'),
    register:(username, password)=>request('/register', {username, password}, 'POST')
}
export default $api