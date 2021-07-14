import { onMounted, onUnmounted, ref } from 'vue';

export default function useWindowResize() {
  const height = ref(1);
  const width = ref(1);

  function resize() {
    height.value = window.innerHeight;
    width.value = window.innerWidth;
  }

  onMounted(() => {
    resize()
    window.addEventListener('resize', resize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', resize);
  });

  const widthPixelsToPercent = (x:number) => x / width.value * 100;
  const heightPixelsToPercent = (x:number) => x / height.value * 100;

  return { windowHeight:height, windowWidth:width, widthPixelsToPercent, heightPixelsToPercent };
}