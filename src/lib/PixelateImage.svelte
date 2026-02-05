<script>
  export let src = '';
  export let alt = 'Pixelating image';
  export let maxPixelSize = 40;
  export let className = '';
  
  let canvas;
  let imageCanvas;
  let ctx;
  let imgCtx;
  let img;
  let animationFrame;
  
  const ANIMATION_DURATION = 3000;
  
  function initCanvas() {
    if (!canvas || !imageCanvas || !src) return;
    
    ctx = canvas.getContext('2d', { willReadFrequently: true });
    imgCtx = imageCanvas.getContext('2d');
    img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      imageCanvas.width = img.width;
      imageCanvas.height = img.height;
      
      imgCtx.drawImage(img, 0, 0);
      
      animate();
    };
    
    img.src = src;
  }
  
  function animate() {
    const startTime = Date.now();
    
    function draw() {
      const elapsed = Date.now() - startTime;
      const progress = (elapsed % ANIMATION_DURATION) / ANIMATION_DURATION;
      
      const eased = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
      let pixelSize;
      if (eased < 0.5) {
        pixelSize = 1 + (eased * 2) * (maxPixelSize - 1);
      } else {
        pixelSize = 1 + ((1 - eased) * 2) * (maxPixelSize - 1);
      }
      
      pixelSize = Math.max(1, Math.round(pixelSize));
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const w = canvas.width;
      const h = canvas.height;
      
      const size = Math.floor(Math.max(w, h) / pixelSize);
      
      ctx.imageSmoothingEnabled = false;
      
      ctx.drawImage(imageCanvas, 0, 0, w, h, 0, 0, size, size);
      
      ctx.drawImage(canvas, 0, 0, size, size, 0, 0, w, h);
      
      animationFrame = requestAnimationFrame(draw);
    }
    
    draw();
  }
  
  $: if (canvas && imageCanvas && src) {
    initCanvas();
  }
  
  import { onMount, onDestroy } from 'svelte';
  
  onMount(() => {
    if (src) initCanvas();
  });
  
  onDestroy(() => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
  });
</script>

<canvas bind:this={imageCanvas} style="display: none;"></canvas>

<canvas bind:this={canvas} class="pixelation-animation {className}" {alt}></canvas>

<style>
  .pixelation-animation {
    max-width: 100%;
    height: auto;
    display: block;
  }
</style>
