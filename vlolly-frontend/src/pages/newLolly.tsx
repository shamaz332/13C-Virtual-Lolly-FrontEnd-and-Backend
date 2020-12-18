import React, { useEffect, useRef, useState } from 'react'
import { Header } from '../components/Header'
import { Lolly } from '../components/lolly'
import { createVlolly } from "../graphql/mutations"
import shortid from "shortid"
import { API } from "aws-amplify"
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
export default function newLolly() {

  const [flavourTop, setFlavourTop] = useState("#ef0078")
  const [flavourMiddle, setFlavourMiddle] = useState("#ff8d00")
  const [flavourEnd, setFlavourEnd] = useState("#dd0074")
  const [recipentName, setRecipentName] = useState("")
  const [message, setMessage] = useState("")
  const [senderName, setSenderName] = useState("")
  const [loading, setLoading] = useState(false)

    const addVlollyMutation = async () => {
      setLoading(true)
    try {
      const lolly = {
        id: shortid.generate(),
        receiver: recipentName,
        message: message,
        sender: senderName,
        top: flavourTop,
        middle: flavourMiddle,
        bottom: flavourEnd

      }
      const data = await API.graphql({
        query: createVlolly,
        variables: {
          lolly: lolly,
        },
      })
      setLoading(false)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className="container">
      <Header />
      <div className="lollyContainer">
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
            <button  onClick={addVlollyMutation}>
            {loading ? "freeze..." : "freeze"}
            </button>
          </div>
        </div>
      </div>
      </div>
  )
}
