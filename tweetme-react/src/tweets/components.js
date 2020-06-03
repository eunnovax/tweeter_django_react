import React, {useState, useEffect} from 'react'
import {loadTweets} from './lookup'

export function TweetsComponent(props) {
  const textAreaRef = React.createRef()
  const handleSubmit = (event) => {
    event.preventDefault()
    const newVal = textAreaRef.current.value
    textAreaRef.current.value = ''
  }
  return <React.Fragment>

    <div className="row my-3 text-center mx-auto w-50">
  <div className='col-12 '>
      <form onSubmit={handleSubmit}>
        <textarea  ref={textAreaRef} required={true} className='form-control' name='tweet'>

        </textarea>
        <button type='submit' className='btn btn-primary my-3'>Tweet</button>
      </form>
    </div>
    </div>
    <TweetsList />
    </React.Fragment>
}

export function TweetsList(props) {
    const [tweets, setTweets] = useState([])
    useEffect(() => {
      const myCallback = (response, status) => {
        // console.log(response, status)
        if (status === 200) {
          setTweets(response)
        }
      }
      loadTweets(myCallback)
    }, [])
  
    return tweets.map((item, index) => {
      return <Tweet tweet={item} key={index} className='mx-auto w-50 my-5 p-5 border bg-white text-dark' />
    })
}

export function ActionBtn(props) {
    const {tweet, action} = props
    const [likes, setLikes] = useState(tweet.likes ? tweet.likes : 0)
    const [userLike, setUserLike] = useState(tweet.userLike ? true : false)
    const className = props.className ? props.className : 'btn btn-primary btn-sm'
    const actionDisplay = action.display ? action.display : 'Action'
    const display = action.type === 'like' ? `${likes} ${actionDisplay}` : actionDisplay
    const handleClick = (event) => {
        event.preventDefault()
        if (action.type === 'like') {
            if(userLike) {
                // unlike
                setLikes(likes - 1)
                setUserLike(false)
            } else {
                setLikes(likes + 1)
                setUserLike(true)
            }
        }
    }
    return <button className={className} onClick={handleClick}>{display} </button> 
  }
  
export function Tweet(props) {
const {tweet} = props
const className = props.className ? props.className : 'col-10 col-md-6 mx-auto' 
return <div className={className}>
    <p>{tweet.id} - {tweet.content}</p>
    <div className='btn btn-group'>
    <ActionBtn tweet={tweet} action={{type: "like", display: "Likes"}} />
    <ActionBtn tweet={tweet} action={{type: "unlike", display: "Unlike"}} />
    <ActionBtn tweet={tweet} action={{type: "retweet", display: "Retweet"}} />
    </div>
</div>
}