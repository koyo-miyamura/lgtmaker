import React, { useState, useEffect } from 'react';
import './App.css'
import Clipboard from "clipboard"

function App() {
  const [ctx, setCtx] = useState(null)
  const [view, setView] = useState(null)

  const canvasWidth = 800
  const canvasHeight = canvasWidth * 9 / 16
  const fontSizePx = 80
  const fontColor = '#FFFFFF'

  useEffect(() => {
    const view = document.querySelector('.canvas')
    view.width = canvasWidth
    view.height = canvasHeight

    setView(view)
    setCtx(view.getContext('2d'))
  }, [canvasHeight])

  const handleUploadImage = (e) => {
    ctx.clearRect(0, 0, view.width, view.height)
    const reader = new FileReader()
    const file = e.target.files[0]
    reader.onloadend = () => {
        const image = new Image()
        image.src = reader.result
        image.onload = () => {
          ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight)
          ctx.save()
          ctx.font = `bolder ${fontSizePx}px 'MS Pゴシック'`
          ctx.textAlign = 'center'
          ctx.fillStyle = fontColor
          ctx.fillText('L G T M', canvasWidth/2, canvasHeight/2)
          ctx.restore()
          setCtx(ctx)
        }
    }
    reader.readAsDataURL(file)
  }

  const handleCopy = () => {
    const view = document.querySelector('.canvas')
    const data = view.toDataURL()
    const copyText = `<img src='${data}' />`
    const clipboard = new Clipboard('.copy', {
      text: () => copyText
    })
    clipboard.on('success', () => {
      alert("コピーしました")
    })
  }

  return (
    <>
      <div className="file-upload">
        <input onChange={handleUploadImage} type="file" accept=".jpg,.png" />
        <button className="copy" onClick={handleCopy}>Copy</button>
      </div>
      <canvas className="canvas"></canvas>
    </>
  )
}

export default App
