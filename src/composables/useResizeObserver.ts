/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';

export const useResizeObserver = () => {
  // create a new ref,
  // which needs to be attached to an element in a template
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resizeRef = ref<HTMLElement>();
  const resizeState = reactive({
    width: 0,
    height: 0,
  });

  const observer = new ResizeObserver((entries) => {
    // called initially and on resize
    entries.forEach((entry) => {
      resizeState.width = entry.contentRect.width;
      resizeState.height = entry.contentRect.height;
    });
  });

  onMounted(() => {
    // set initial dimensions right before observing: Element.getBoundingClientRect()
    resizeState.width = resizeRef.value?.clientWidth || 0;
    resizeState.height = resizeRef.value?.clientHeight || 0;
    observer.observe(resizeRef.value as Element);
  });

  onBeforeUnmount(() => {
    observer.unobserve(resizeRef.value as Element);
  });

  // return to make them available to whoever consumes this hook
  return { resizeState, resizeRef };
};

export default useResizeObserver;
