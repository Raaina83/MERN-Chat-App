const getOrSaveFromStorage = ({key, value, get}) => {
    if(get) return localStorage.getItem(key)? JSON.parse(localStorage.getItem(key)) : null
    else localStorage.setItem(key, JSON.stringify(value))

}

const fileFormat = (url= "") => {
    const extension = url.split(".").pop() //splits after . and returns last string bit bcz pf pop

    if (extension === "mp4" || extension === "ogg" || extension=== "webm") return "video"

    if(extension === "mp3" || extension === "wav") return "audio"

    if (
        extension === "jpg" || 
        extension === "jpeg" || 
        extension=== "gif" ||
        extension === "png"
    ) return "image"

    return "file"
    
}   

const transformImage = (url = '') => url

export {getOrSaveFromStorage, fileFormat, transformImage}