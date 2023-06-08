// const { useSelector } = require("src/redux/store")

import { PATH_APP } from "../routes/paths"

let NAVIGATION_PATH = ""
export function navigateTo(state){
    console.log("chal ra h navigate")

    // const state = useSelector(state=>state.feature.currentSelection)
    const currentDsKey = state.dataMap[state.currentDataMap].dsKey
    state.dSourceStatus[currentDsKey].forEach(item=>{
        if(((item.status).toLowerCase())==="in progress"){
                if(item.stage.toLowerCase()==="Data Upload"){
                    NAVIGATION_PATH=PATH_APP.general.mapping;
                }else if(item.stage.toLowerCase()==="Feature Map"){
                    NAVIGATION_PATH=PATH_APP.general.columnimport;
                }else if(item.stage.toLowerCase()==="Value Map"){
                    NAVIGATION_PATH=PATH_APP.general.analytics;
                }
        }
    })
    console.log(state.dSourceStatus[currentDsKey])

    

}