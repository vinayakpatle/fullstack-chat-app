import {useState,useRef} from 'react';
import {useChatStore} from "../store/useChatStore";
import {Image,Send,X} from 'lucide-react';
import toast from 'react-hot-toast';

const MessageInput = () => {
  const [text,setText] =useState("");
  const [imagePreview,setImagePreview]=useState(null);
  const fileInputRef=useRef();
  const {sendMessage}=useChatStore();

  const handleImageChange=(e)=>{
    const file=e.target.files[0];
    if(!file) return toast.error("Please select an image file");

    const reader=new FileReader();
    reader.readAsDataURL(file);
    reader.onload=()=>{
      setImagePreview(reader.result);
    }
    
  }

  const removeImage=()=>{
    setImagePreview(null);
    if(fileInputRef.current) fileInputRef.current.value="";
  }

  const handleSendMessaage=async(e)=>{
    e.preventDefault();
    if(!text.trim() && !imagePreview) return ;

    try{
      await sendMessage({
        text:text.trim(),
        image:imagePreview,
      })

      // clear from
      setText("");
      setImagePreview(null);
      if(fileInputRef.current) fileInputRef.current.value="";
    }catch(e){
      console.log(e.response.data.message);
    }
  }

  return (
    <div className='p-4 w-full'>
      {imagePreview && (
        <div className='mb-3 flex items-center gap-2'>
          <div className='relative'>
            <img 
              src={imagePreview}
              alt={"Preview"}
              className='size-20 object-cover rounded-lg border border-base-700'
            />
            <button 
              onClick={removeImage}
              className='absolute top-1.5 right-1.5 size-5 rounded-full bg-base-300 flex items-center justify-center'
              type='button'
            >
              <X className='size-3' />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessaage} className='flex items-center gap-2'>
        <div className='flex-1 flex gap-2'>
          <input
            type='text'
            className='w-full input input-bordered rounded-lg input-sm sm:input-md '
            placeholder='Type a message...'
            value={text}
            onChange={(e)=>setText(e.target.value)}
           />

           <input
            type='file'
            accept='image/*'
            className='hidden'
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type='button'
            className={`hidden sm:flex btn btn-circle ${imagePreview? "text-emerald-500" : "text-zinc-400"}`}
            onClick={()=>fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button 
          type='submit'
          className='btn sm:size-12 btn-sm btn-circle'
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  )
}

export default MessageInput