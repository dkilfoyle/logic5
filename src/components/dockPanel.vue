<template>
  <teleport :to="teleportTarget" v-if="isMounted">
    <transition name="fade">
      <div v-show="isSelectedTab(name)" class="tab-panel tab-panel-active">
        <slot />
      </div>
    </transition>
  </teleport>
</template>

<script>
import {
  defineComponent,
  inject,
  ref,
  onBeforeMount,
  onMounted,
  computed,
} from 'vue';
import useDockTabs from '../composables/useDockTabs';

export default defineComponent({
  name: 'Tab',
  props: {
    name: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
  },

  setup(props) {
    const { addTab, getTabBarId, isSelectedTab, setSelectedTab } =
      useDockTabs();

    const teleportTarget = computed(() => {
      return '#' + getTabBarId(props.name);
    });

    const isMounted = ref(false);
    onMounted(() => {
      isMounted.value = true;
    });

    const tabsProvider = inject('tabsProvider');
    onBeforeMount(() => {
      addTab(tabsProvider.name, {
        name: props.name,
        icon: props.icon,
        label: props.label || props.name,
        isDisabled: props.isDisabled,
      });
      if (props.isSelected) setSelectedTab(tabsProvider.name, props.name);
    });

    return {
      isMounted,
      teleportTarget,
      getTabBarId,
      isSelectedTab,
    };
  },
});
</script>

<style>
.fade-enter-active {
  transition: opacity 0.3s ease-out;
}
.fade-enter-from {
  opacity: 0;
}
.fade-enter-to {
  opacity: 1;
}
</style>
