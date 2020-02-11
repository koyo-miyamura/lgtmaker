import React, { useState, useEffect } from 'react';
import './App.css'

function App() {
  const [ctx, setCtx] = useState(null)
  const [view, setView] = useState(null)

  useEffect(() => {
    const view = document.querySelector('.canvas')
    view.width = 1000
    view.height = 1000 * (window.innerHeight / window.innerWidth)

    setView(view)
    setCtx(view.getContext('2d'))
  }, [])

  const handleUploadImage = (e) => {
    ctx.clearRect(0, 0, view.width, view.height)
    const reader = new FileReader()
    const file = e.target.files[0]
    reader.onloadend = () => {
        const image = new Image()
        image.src = reader.result
        image.onload = () => {
          ctx.drawImage(image, 0, 0)
        }
    }
    reader.readAsDataURL(file)
  }

  return (
    <>
      <div className="file-upload">
        <input onChange={handleUploadImage} type="file" accept=".jpg,.png" />
      </div>
      <canvas className="canvas"></canvas>
    </>
  );
}

export default App;
