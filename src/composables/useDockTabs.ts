import { reactive, computed } from 'vue';

export interface TabInterface {
  name: string,
  icon: string,
  label: string,
  isDisabled: boolean
}

export interface DragResultInterface {
  removedIndex: number,
  addedIndex: number,
  payload: TabInterface
}

const state = reactive({
  tabBars: {} as {[index:string]: {
    selected: string,
    tabs: Array<TabInterface>
  }},
})

export default ()=> {
  
  const tabBarNames = computed(() => Object.keys(state.tabBars));

  const addTab = (tabBarId:string, tab:TabInterface):void => {
    if (!state.tabBars[tabBarId]) state.tabBars[tabBarId] = {tabs:[],selected:''};
    state.tabBars[tabBarId].tabs.push(tab);
  }
  
  const getTab = (tabId: string):TabInterface|null => {
    for (const tabBar of tabBarNames.value) {
      const found = state.tabBars[tabBar].tabs.find(x => x.name == tabId)
      if (found) return found;
    }
    return null;
  }
  const getTabs = (tabBarId: string) => {
    return state.tabBars[tabBarId]?.tabs
  }

  const setSelectedTab = (tabBarId: string, tabId: string):void => {
    state.tabBars[tabBarId].selected = tabId;
  }
  const getSelectedTab = (tabBarId: string):string => state.tabBars[tabBarId].selected;
  const isSelectedTab = (tabId: string):boolean => {
    for (const tabBarId of tabBarNames.value) {
      if (getSelectedTab(tabBarId) == tabId) return true
    }
    return false;
  }

  const getTabBarId = (tabId: string):string => {
    for (const tabBarId of tabBarNames.value) {
      if (state.tabBars[tabBarId].tabs.some(x=>x.name == tabId)) return tabBarId
    }
    return '';
  }

  const doDragDrop = (tabBarId:string, dragResult: DragResultInterface):void => {
    const { removedIndex, addedIndex, payload } = dragResult;
    console.log('doDragDrop: ', tabBarId, removedIndex, addedIndex, payload);
    if (removedIndex === null && addedIndex === null) return;
    const result = state.tabBars[tabBarId].tabs;
    let itemToAdd = payload;

    if (removedIndex !== null) {
      itemToAdd = result.splice(removedIndex, 1)[0];
    }
    if (addedIndex !== null) {
      result.splice(addedIndex, 0, itemToAdd);
    }
  };

  return {
    addTab,
    getTab,
    getTabs,
    setSelectedTab,
    getSelectedTab,
    isSelectedTab,
    getTabBarId,
    doDragDrop,
    tabBarNames
  }
};