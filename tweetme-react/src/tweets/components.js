import React, {useState, useEffect} from 'react'
import {apiTweetList, apiTweetCreate, apiTweetAction} from './lookup.js'

export function TweetsComponent(props) {
  const textAreaRef = React.createRef()
  const [newTweets, setNewTweets] = useState([])

  const handleBackendUpdate = (response, status) => {
    //backend api response handler
    let tempNewTweets = [...newTweets]
    // console.log(response)
    if (status === 201) {
      tempNewTweets.unshift(response)
      setNewTweets(tempNewTweets)
    } else {
      console.log(response) 
      alert("An error occured please try again")
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const newVal = textAreaRef.current.value
    //backend api request
    apiTweetCreate(newVal, handleBackendUpdate)
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
    <TweetsList newTweets={newTweets} />
    </React.Fragment>
}

export function TweetsList(props) {
    const [tweetsInit, setTweetsInit] = useState([])
    const [tweets, setTweets] = useState([])
    const [tweetsDidSet, setTweetsDidSet] = useState(false)
    // setTweetsInit([...props.newTweets].concat(tweetsInit))
    useEffect(() => {
      const final = [...props.newTweets].concat(tweetsInit)
      if (final.length !== tweets.length) {
        setTweets(final)
      }
    }, [props.newTweets, tweetsInit, tweets])
    useEffect(() => {
      if (tweetsDidSet === false) {
        const handleTweetListLookup = (response, status) => {
          // console.log(response, status)
          if (status === 200) {
            setTweetsInit(response)
            setTweetsDidSet(true)
          } else {
            alert("There was an error")
          }
        }
        apiTweetList(handleTweetListLookup)
      }
    }, [tweetsInit, tweetsDidSet, setTweetsDidSet])
  
    return tweets.map((item, index) => {
      return <Tweet tweet={item} key={index} className='mx-auto w-50 my-5 p-5 border bg-white text-dark text-center' />
    })
}

export function ActionBtn(props) {
    const {tweet, action, didPerformAction} = props
    const likes = tweet.likes ? tweet.likes : 0 
    const className = props.className ? props.className : 'btn btn-primary btn-sm'
    const actionDisplay = action.display ? action.display : 'Action'
    const display = action.type === 'like' ? `${likes} ${actionDisplay}` : actionDisplay
    const handleActionBackendEvent = (response, status) => {
      console.log(response, status)
      if ((status === 200 || status === 201) && didPerformAction) {
        didPerformAction(response, status)
      }
    }
    const handleClick = (event) => {
        event.preventDefault()
        apiTweetAction(tweet.id, action.type, handleActionBackendEvent)
    }
    return <button className={className} onClick={handleClick}>{display} </button> 
  }

export function ParentTweet(props) {
  const {tweet} = props
  return tweet.parent ? <div className="row">
    <div className="col-11 mx-auto p-3 border rounded">
      <p className="mb-0 text-muted small">Retweet</p>
      <Tweet tweet={tweet.parent} />
    </div>
  </div> : null
}  

export function Tweet(props) {
const {tweet} = props
const [actionTweet, setActionTweet] = useState(props.tweet ? props.tweet : null)
const className = props.className ? props.className : 'col-10 col-md-6 mx-auto' 
const handlePerformAction = (newActionTweet, status) => {
  if(status === 200) {
    setActionTweet(newActionTweet)
  } else if (status === 201) {
    //let the tweet list know
  }
}

return <div className={className}>
  <div>
    <p>{tweet.id} - {tweet.content}</p>
    < ParentTweet tweet={tweet} />
  </div>
    {actionTweet && <div className='btn btn-group'>
    <ActionBtn tweet={actionTweet} didPerformAction={handlePerformAction} action={{type: "like", display: "Likes"}} />
    <ActionBtn tweet={actionTweet} didPerformAction={handlePerformAction} action={{type: "unlike", display: "Unlike"}} />
    <ActionBtn tweet={actionTweet} didPerformAction={handlePerformAction} action={{type: "retweet", display: "Retweet"}} />
    </div>}
</div>
}