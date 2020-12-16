import React, { useEffect, useRef, useState } from 'react'
import { Header } from '../component/Header'
import { Lolly } from '../component/lolly'
import { useMutation, useQuery } from '@apollo/client'
import gql from "graphql-tag"
import Share from "../../src/component/Share"
import shortid from "shortid"

const ADD_LOLLY = gql`
  mutation createLolly($recipientName: String!, $message: String!, $senderName: String!, $flavourTop: String!, $flavourMiddle: String!,$flavourBottom: String!) {
    createLolly(recipientName: $recipientName, message: $message, senderName: $senderName, flavourTop: $flavourTop, flavourMiddle: $flavourMiddle,flavourBottom: $flavourBottom) {
       senderName
        message
        lollyPath
        recipientName
    }
  }
  `


export default function newLolly() {

  const [createLolly,{ data }] = useMutation(ADD_LOLLY)
  const [flavourTop, setFlavourTop] = useState("#ef0078")
  const [flavourMiddle, setFlavourMiddle] = useState("#ff8d00")
  const [flavourEnd, setFlavourEnd] = useState("#dd0074")
  const [recipentName, setRecipentName] = useState("")
  const [message, setMessage] = useState("")
  const [senderName, setSenderName] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    const id = shortid.generate()
    const result = await createLolly({
      variables: {
        recipientName: recipentName,
        senderName: senderName,
        message: message,
        flavourTop: flavourTop,
        flavourMiddle: flavourMiddle,
        flavourBottom: flavourEnd,
        lollyPath: id,
        
      
      },
    })
    setLoading(false)

  }
  useEffect(() => {
    async function runHook() {
        const response = await fetch("https://api.netlify.com/build_hooks/5fb7d33234b12500f0272719", {
            method: "POST",
        });

    }
    runHook();

}, [data])
  return (
    <div className="container">
      <Header />
      {!data ? <>   <div className="lollyFormDiv">
        <div>
          <Lolly
            fillLollyBottom={flavourEnd}
            fillLollyMiddle={flavourMiddle}
            fillLollyTop={flavourTop}
          />
        </div>
        <div className="lollyFlavourDiv">
          <label>
            <input
              type="color"
              name="top"
              value={flavourTop}
              onChange={e => setFlavourTop(e.target.value)}
            />
          </label>
          <label>
            <input
              type="color"
              name="middle"
              value={flavourMiddle}
              onChange={e => setFlavourMiddle(e.target.value)}
            />
          </label>
          <label>
            <input
              type="color"
              name="bottom"
              value={flavourEnd}
              onChange={e => setFlavourEnd(e.target.value)}
            />
          </label>
        </div>
        <div className="formContainer">
          <label>To</label>
          <input
            type="text"
            required
            onChange={e => setRecipentName(e.target.value)}
          />
          <label>Message</label>
          <textarea
            style={{ resize: "none" }}
            rows={7}
            required
            onChange={e => setMessage(e.target.value)}
          />
          <label>From</label>
          <input
            type="text"
            required
            onChange={e => setSenderName(e.target.value)}
          />
          <div className="formBtn-wrapper">
            <button onClick={handleSubmit}>
             Freeze Lolly
            </button>
          </div>
        </div>
      </div>
      </>: <Share lollyPath={data?.createLolly?.lollyPath} recipientName={data?.createLolly?.recipientName} senderName={data?.createLolly?.senderName} message={data?.createLolly?.message} />}
    </div>
  )
}
