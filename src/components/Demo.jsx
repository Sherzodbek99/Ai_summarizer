import { useState, useEffect } from 'react'
import { copy, linkIcon, loader, tick, deleteBtn } from '../assets'
import { useLazyGetSummaryQuery } from '../services/article'
const Demo = () => {
  const [article, setArticle] = useState({
    url : '',
    summary : ''
  }) 
  const [allArticles, setAllArticles] = useState([])
  const [copied, setCopied] = useState("")
  const [ getSummary, { error, isFetching}] = useLazyGetSummaryQuery()

  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem('articles')
    )

    if(articlesFromLocalStorage){
      setAllArticles(articlesFromLocalStorage)
    }
  }, [])

  const handleSumbit = async (e) => {
    e.preventDefault()
    const { data } = await getSummary({ articleUrl: article.url })
    
    if( data?.summary) {
        const newArticle = { ...article, summary: data.summary }
        const updatedAllArticles = [newArticle, ...allArticles]
        setArticle(newArticle)
        setAllArticles(updatedAllArticles)
        
        localStorage.setItem('articles', JSON.stringify(updatedAllArticles))
    }
  }

  const handleCopy = (copyUrl) => {
    setCopied(copyUrl)
    navigator.clipboard.writeText(copyUrl)
    setTimeout(() => setCopied(false), 3000)
  }

  // const handleDelete = (index) => {
  //   //const removedItem = allArticles[index]
  //   console.log(allArticles[index])
  //   // localStorage.removeItem(allArticles[index])
  //   const updatedAllArticles2 = allArticles
  //   updatedAllArticles2.splice(index, 1)
 

  //   localStorage.setItem('articles', JSON.stringify(updatedAllArticles2))
  //   setArticle({
  //     url : '',
  //     summary : ''
  //   })
  //   setAllArticles(updatedAllArticles2)
  //   console.log(updatedAllArticles2)
  // }



  return (
    <section className="mt-16 w-full max-w-xl">
        <div className="flex flex-col w-full gap-2">
            <form className="relative flex justify-center items-center"
                  onSubmit={handleSumbit}
            >
                <img src={linkIcon} alt="link_icon" className='absolute left-0 my-2 ml-3 w-5'/>
                
                <input type="url" 
                       placeholder='Enter a URL'
                       value={article.url}
                       onChange={(e) => {setArticle({...article, url: e.target.value})}}
                       required
                       className='url_input peer'  
                />

                <button className='submit_btn
                        peer-focus:border-gray-700
                        peer-focus:text-gray-700' 
                        type='submit'>⏎</button>    

            </form>

            <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
              {allArticles.map((item, index) => (
                <div className="link_card" 
                     onClick={() => setArticle(item)}
                     key={`link-${index}`} 
                >
                  <div className="copy_btn" onClick={() => handleCopy(item.url)}>
                    <img src={copied === item.url ? tick : copy} alt="copy_icon" className='w-[40%] h-[40%] object-contain'/>
                  </div>

                  <p className="flex-1 font-satoshi text-blue-700 font-medium text-sm truncate">
                    {item.url}
                  </p>

               {/* {   <div className="copy_btn" onClick={() => handleDelete(index)}>
                    <img src={deleteBtn} alt="delete_icon" 
                    className='w-[40%] h-[40%] object-contain'/>
                  </div>} */}
                </div>
              ))}
            </div>
        </div>


        <div className="my-10 max-w-full flex justify-center items-center">
          {isFetching ? (
            <img src={loader} alt='loader' className='w-20 h-20 object-contain' />
          ) : error  ? (
            <p className='font-inter font-bold text-black text-center'>
              Well, that wasn&apost supposed to happen...
              <br />
              <span className="font-satoshi font-normal text-gray-700">
                {error?.data?.error}
              </span>
            </p>
          ) : (
            article.summary && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <h2 className="font-satoshi font-bold text-gray-600 text-xl">
                      Article <span className="blue_gradient">Summary</span>
                    </h2>

                    <div className="copy_btn_summary" onClick={() => handleCopy(article.summary)}>
                        <img src={copied === article.summary ? tick : copy} alt="copy_icon" className='w-[60%] h-[60%] object-contain'/>
                      </div>
                </div>
                
                <div className="summary_box">
                  <p className='font-inter font-medium text-sm text-gray-700'>
                    {article.summary}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
    </section>
  )
}

export default Demo

