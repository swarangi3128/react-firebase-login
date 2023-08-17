// import React, { useEffect, useState } from 'react';
// import Loader from '../Loader/Loader';
// import './PageConversations.css';

// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const PageConversations = ({ pageId, accessToken }) => {
//   const [conversations, setConversations] = useState([]);
//   const [selectedConversation, setSelectedConversation] = useState(null);
//   const [replyText, setReplyText] = useState('');
//   const [loading, setLoading] = useState(false);
//   const batchSize = 5;
//   const [showMessages, setShowMessages] = useState(batchSize);

//   useEffect(() => {
//     const getPageConversations = () => {
//       setLoading(true);
//       window.FB.api(`/${pageId}/conversations`, 'GET', { access_token: accessToken }, (response) => {
//         if (response.data && response.data.length > 0) {
//           const conversationData = response.data;

//           const getPageMessages = (conversation) => {
//             return new Promise((resolve) => {
//               window.FB.api(
//                 `/${conversation.id}`,
//                 'GET',
//                 { fields: 'messages', access_token: accessToken },
//                 (messageResponse) => {
//                   console.log('Message response');
//                   if (
//                     messageResponse.messages &&
//                     messageResponse.messages.data &&
//                     messageResponse.messages.data.length > 0
//                   ) {
//                     const messageData = messageResponse.messages.data;

//                     const getMessage = (message) => {
//                       return new Promise((resolve) => {
//                         window.FB.api(
//                           `/${message.id}`,
//                           'GET',
//                           { fields: 'from,id,message,created_time', access_token: accessToken },
//                           (messageDetails) => {
//                             if (messageDetails && messageDetails.message) {
//                               resolve({
//                                 id: messageDetails.id,
//                                 message: messageDetails.message,
//                                 from: messageDetails.from.name,
//                                 recipientID: messageDetails.from.id,
//                               });
//                               console.log(messageDetails.message);
//                             } else {
//                               resolve(null);
//                             }
//                           }
//                         );
//                       });
//                     };

//                     Promise.all(messageData.map((message) => getMessage(message))).then((messages) => {
//                       resolve({
//                         id: conversation.id,
//                         messages: messages.filter((message) => message !== null),
//                       });
//                     });
//                   } else {
//                     resolve(null);
//                   }
//                 }
//               );
//             });
//           };

//           Promise.all(conversationData.map((conversation) => getPageMessages(conversation))).then((conversations) => {
//             setConversations(conversations.filter((conversation) => conversation !== null));
//             console.log('Last Message ', conversations[0].messages[conversations[0].messages.length - 1].recipientID);
//           });
//           setLoading(false);
//         } else {
//           setLoading(false);
//           console.log(response.error)
//         }
//       });
//     };

//     getPageConversations();
//   }, [pageId, accessToken]);

//   const handleReplyChange = (event) => {
//     setReplyText(event.target.value);
//   };

//   const handleReplySubmit = (conversationId) => {
//     if (replyText.trim() !== '') {
//       const messageData = {
//         recipient: {
//           id: conversationId,
//         },
//         messaging_type: 'RESPONSE',
//         message: {
//           text: replyText,
//         },
//       };
//       setLoading(true);
//       window.FB.api(`/${pageId}/messages`, 'POST', { access_token: accessToken, ...messageData }, (response) => {
//         if (response && !response.error) {
//           setLoading(false);
//           toast.success('Reply sent successfully!');
//           setReplyText('');
//         } else {
//           setLoading(false);
//           console.log(response.error);
//           toast.error('Error sending reply.');
//         }
//       });
//     } else {
//       toast.error('Reply text is empty.');
//     }
//   };

//   const handleShowMoreMessages = () => {
//     setShowMessages((prev) => prev + batchSize);
//   };
//   const handleShowLessMessages = () => {
//     setShowMessages((prev) => prev - batchSize);
//   };

//   const handleConversationSelect = (conversationId) => {
//     const selectedConv = conversations.find((conv) => conv.id === conversationId);
//     setSelectedConversation(selectedConv);
//   };

//   const checkLength = (conversation) => {
//     if (conversation.messages.length > 5) {
//       return true;
//     }
//     return false;
//   };

//   useEffect(() => {
//     console.log('Selected Conversation: ', selectedConversation);
//   }, [selectedConversation]);

//   return (
//     <div className="page-conversations">
//       {loading && <Loader />}
//       <ToastContainer />
//       {conversations.length > 0 && (
//         <div className="conversation-dropdown">
//           <h1 className="conversation-heading">Select Conversation:</h1>
//           <select className="conversation-select" onChange={(event) => handleConversationSelect(event.target.value)}>
//             <option value="">Select</option>
//             {conversations.map((conversation) => (
//               <option key={conversation.id} value={conversation.id}>
//                 {conversation.messages[conversation.messages.length - 1].from}
//               </option>
//             ))}
//           </select>
//         </div>
//       )}
//       {selectedConversation && (
//         <>
//           <h1 className="conversation-heading">Your Conversation with: {selectedConversation.messages[selectedConversation.messages.length - 1].from}</h1>
//           <ul className="message-list">
//             {selectedConversation.messages.length > 5 ? (
//               selectedConversation.messages.slice(0, showMessages).map((message, index) => (
//                 <li key={index} className="message-item">
//                   <h3 className="conversation-participant">From: {selectedConversation.messages[index].from}</h3>
//                   {message.message}
//                 </li>
//               ))
//             ) : (
//               selectedConversation.messages.map((message, index) => (
//                 <li key={index} className="message-item">
//                   <h3 className="conversation-participant">From: {selectedConversation.messages[index].from}</h3>
//                   {message.message}
//                 </li>
//               ))
//             )}
//           </ul>
//           <div className="reply-section">
//             <input
//               type="text"
//               className="reply-input"
//               value={replyText}
//               onChange={handleReplyChange}
//               placeholder="Type your reply..."
//             />
//             <button className="reply-button" onClick={() => handleReplySubmit(selectedConversation.messages[selectedConversation.messages.length - 1].recipientID)}>
//               Reply
//             </button>
//           </div>
//           {checkLength(selectedConversation) && (
//             <>
//               {selectedConversation.messages.length > showMessages ? (
//                 <button className='reply-button' onClick={handleShowMoreMessages}>
//                   Show More messages
//                 </button>
//               ) : (
//                 <button className='reply-button' onClick={handleShowLessMessages}>
//                   Show Less messages
//                 </button>
//               )}
//             </>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default PageConversations;

import React, { useEffect, useState } from 'react';
import Loader from '../Loader/Loader';
import './PageConversations.css';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PageConversations = ({ pageId, accessToken }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);
  const batchSize = 5;
  const [showMessages, setShowMessages] = useState(batchSize);

  const resetSelectedConversation = () => {
    setSelectedConversation(null);
  };

  useEffect(() => {
    const getPageConversations = () => {
      setLoading(true);
      window.FB.api(`/${pageId}/conversations`, 'GET', { access_token: accessToken }, (response) => {
        if (response.data && response.data.length > 0) {
          const conversationData = response.data;

          const getPageMessages = (conversation) => {
            return new Promise((resolve) => {
              window.FB.api(
                `/${conversation.id}`,
                'GET',
                { fields: 'messages', access_token: accessToken },
                (messageResponse) => {
                  console.log('Message response');
                  if (
                    messageResponse.messages &&
                    messageResponse.messages.data &&
                    messageResponse.messages.data.length > 0
                  ) {
                    const messageData = messageResponse.messages.data;

                    const getMessage = (message) => {
                      return new Promise((resolve) => {
                        window.FB.api(
                          `/${message.id}`,
                          'GET',
                          { fields: 'from,id,message,created_time', access_token: accessToken },
                          (messageDetails) => {
                            if (messageDetails && messageDetails.message) {
                              resolve({
                                id: messageDetails.id,
                                message: messageDetails.message,
                                from: messageDetails.from.name,
                                recipientID: messageDetails.from.id,
                              });
                              console.log(messageDetails.message);
                            } else {
                              resolve(null);
                            }
                          }
                        );
                      });
                    };

                    Promise.all(messageData.map((message) => getMessage(message))).then((messages) => {
                      resolve({
                        id: conversation.id,
                        messages: messages.filter((message) => message !== null),
                      });
                    });
                  } else {
                    resolve(null);
                  }
                }
              );
            });
          };

          Promise.all(conversationData.map((conversation) => getPageMessages(conversation))).then((conversations) => {
            setConversations(conversations.filter((conversation) => conversation !== null));
            console.log('Last Message ', conversations[0].messages[conversations[0].messages.length - 1].recipientID);
          });
          setLoading(false);
        } else {
          setLoading(false);
          console.log(response.error)
        }
      });
    };

    setConversations([]); // Clear conversations when changing the page
    setSelectedConversation(null); // Clear selected conversation when changing the page
    getPageConversations();
  }, [pageId, accessToken]);

  const handleReplyChange = (event) => {
    setReplyText(event.target.value);
  };

  const handleReplySubmit = (conversationId) => {
    if (replyText.trim() !== '') {
      const messageData = {
        recipient: {
          id: conversationId,
        },
        messaging_type: 'RESPONSE',
        message: {
          text: replyText,
        },
      };
      setLoading(true);
      window.FB.api(`/${pageId}/messages`, 'POST', { access_token: accessToken, ...messageData }, (response) => {
        if (response && !response.error) {
          setLoading(false);
          toast.success('Reply sent successfully!');
          setReplyText('');
        } else {
          setLoading(false);
          console.log(response.error);
          toast.error('Error sending reply.');
        }
      });
    } else {
      toast.error('Reply text is empty.');
    }
  };

  const handleShowMoreMessages = () => {
    setShowMessages((prev) => prev + batchSize);
  };
  const handleShowLessMessages = () => {
    setShowMessages((prev) => prev - batchSize);
  };

  const handleConversationSelect = (conversationId) => {
    const selectedConv = conversations.find((conv) => conv.id === conversationId);
    setSelectedConversation(selectedConv);
  };

  const checkLength = (conversation) => {
    if (conversation.messages.length > 5) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    console.log('Selected Conversation: ', selectedConversation);
  }, [selectedConversation]);

  return (
    <div className="page-conversations">
      {loading && <Loader />}
      <ToastContainer />
      {conversations.length > 0 && (
        <div className="conversation-dropdown">
          <h1 className="conversation-heading">Select Conversation:</h1>
          <select className="conversation-select" onChange={(event) => {
            resetSelectedConversation();
            handleConversationSelect(event.target.value);
          }}>
            <option value="">Select</option>
            {conversations.map((conversation) => (
              <option key={conversation.id} value={conversation.id}>
                {conversation.messages[conversation.messages.length - 1].from}
              </option>
            ))}
          </select>
        </div>
      )}
      {selectedConversation && (
        <>
          <h1 className="conversation-heading">Your Conversation with: {selectedConversation.messages[selectedConversation.messages.length - 1].from}</h1>
          <ul className="message-list">
            {selectedConversation.messages.length > 5 ? (
              selectedConversation.messages.slice(0, showMessages).map((message, index) => (
                <li key={index} className="message-item">
                  <h3 className="conversation-participant">From: {selectedConversation.messages[index].from}</h3>
                  {message.message}
                </li>
              ))
            ) : (
              selectedConversation.messages.map((message, index) => (
                <li key={index} className="message-item">
                  <h3 className="conversation-participant">From: {selectedConversation.messages[index].from}</h3>
                  {message.message}
                </li>
              ))
            )}
          </ul>
          <div className="reply-section">
            <input
              type="text"
              className="reply-input"
              value={replyText}
              onChange={handleReplyChange}
              placeholder="Type your reply..."
            />
            <button className="reply-button" onClick={() => handleReplySubmit(selectedConversation.messages[selectedConversation.messages.length - 1].recipientID)}>
              Reply
            </button>
          </div>
          {checkLength(selectedConversation) && (
            <>
              {selectedConversation.messages.length > showMessages ? (
                <button className='reply-button' onClick={handleShowMoreMessages}>
                  Show More messages
                </button>
              ) : (
                <button className='reply-button' onClick={handleShowLessMessages}>
                  Show Less messages
                </button>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default PageConversations;

