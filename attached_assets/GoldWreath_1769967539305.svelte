<script>
  // You can customize these props as needed
  export let width = "300px";
  export let height = "auto";
  export let className = "";
  export let alt = "Gold wreath animation";
</script>

<img
  src="/gold-wreath.webp"
  {alt}
  style="width: {width}; height: {height};"
  class={className}
/>

<style>
  img {
    display: block;
    max-width: 100%;
    height: auto;
  }
</style>
