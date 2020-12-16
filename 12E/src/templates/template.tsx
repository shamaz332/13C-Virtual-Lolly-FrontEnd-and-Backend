import React from 'react'
import {Header} from '../component/Header'
import { Lolly } from '../component/lolly'
import Share from '../component/Share'

const Template = ({ pageContext: { flavourTop, flavourMiddle, flavourBottom, recipientName, senderName, message, lollyPath } }) => {

    return (
      
        <div>
            <Header />
            <div className="lollyFormDiv">

                <div>
                    <Lolly fillLollyTop={flavourTop} fillLollyMiddle={flavourMiddle} fillLollyBottom={flavourBottom} />
                </div>
                <Share lollyPath={lollyPath} recipientName={recipientName} senderName={senderName} message={message} />
            </div>
        </div>
    )
}

export default Template

