import { reactive, computed } from 'vue';

export interface TabInterface {
  name: string,
  icon: string,
  label: string,
  isDisabled: boolean
}

export interface DragDropAction {
  sourceTabsId: string,
  sourceTabIndex: number,
  targetTabsId: string,
  targetTabIndex: number
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
    if (!state.tabBars[tabBarId]) console.log(`getTabs(${tabBarId}): invalid tabBarId`);
    return state.tabBars[tabBarId]?.tabs || [];
  }

  const getState = () => state;

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

  const doDragDrop = (dropResult: DragDropAction):void => {
    const { sourceTabsId, sourceTabIndex, targetTabsId, targetTabIndex } = dropResult;
    console.log('doDragDrop: ', dropResult);
    const targetTabs = getTabs(targetTabsId);
    const sourceTabs = getTabs(sourceTabsId);
    const itemToAdd = sourceTabs.splice(sourceTabIndex, 1)[0];
    targetTabs.splice(targetTabIndex, 0, itemToAdd);
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
    tabBarNames,
    getState
  }
};