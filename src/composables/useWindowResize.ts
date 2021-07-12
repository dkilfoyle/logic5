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

  return { windowHeight:height, windowWidth:width };
}