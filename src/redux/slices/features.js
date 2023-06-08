import sum from 'lodash/sum';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  category: [],
  subCategories: [],
  currentDataMap: 0,
  dbName: [],
  formFields: {},
  currentSelection: {
    currentDsKey: '',
    projectKey: '',
    category: '',
    subCategory: '',
    dateColName:"",
    dateColNameFormat:"",
    currentStartDate:"",
    currentEndDate:"",
    currentFeatureMap:"",
    currentSelectedFeatureCiColumn:"",
    currentSelectedFeatureMapValues:[],
    currentFeatureValueMapVariables:[],
    steps:[],
    dSourceStatus:[],
    currentDataMap:0,
    dataMap: [],
    table: {
      selected: -1,
      tableNames: [],
    },
    currentFeatureMapValue:[],
    columnNames:[],
    selectedColumns:[],
    unSelectedColumns:[],
    featureColumns:[],
    mappedColumns:[],
    mainVariableMappedData:{}
  },
};

const slice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    createProject(state, action) {
      state.isLoading = false;
      // eslint-disable-next-line
      state.currentSelection.projectKey = action.payload['projectKey'];
    },

    dSourceStatus(state, action) {
      state.currentSelection.dSourceStatus = action.payload;
    },
    // GET PRODUCTS
    // getProductsSuccess(state, action) {
    //   state.isLoading = false;
    //   state.products = action.payload;
    // },
    getSuccessCategory(state, action) {
      state.isLoading = false;
      state.category = action.payload;
    },

    getSuccessDbName(state, action) {
      state.isLoading = false;
      state.dbName = action.payload;
    },

    getSuccessFormFields(state, action) {
      state.isLoading = false;
      state.formFields = action.payload;
    },
    chnageCurrentDataMapCurrentState(state, action) {
      state.isLoading = false;
      state.currentSelection.dataMap[state.currentSelection.currentDataMap].currentStep =
        action.payload;
    },
    setDateColName(state, action) {
      state.currentSelection.dateColName = action.payload;
    },
    setDateColFormat(state, action) {
      state.currentSelection.dateColNameFormat = action.payload;
    },
    setCurrentStartDate(state, action) {
      state.currentSelection.currentStartDate = action.payload;
    },
    setCurrentEndDate(state, action) {
      state.currentSelection.currentEndDate = action.payload;
    },

    saveTableName(state, action) {
      state.isLoading = false;
      state.currentSelection.table.tableNames = action.payload;
    },

    setSelectedTable(state, action) {
      state.currentSelection.table.selected = action.payload;
    },

    getColumnsNames(state, action) {
      state.isLoading = false;
      state.currentSelection.columnNames = action.payload;
    },

    saveSelectedColumns(state, action) {
      state.currentSelection.selectedColumns = action.payload;
    },
    saveUnSelectedColumns(state, action) {
      state.currentSelection.unSelectedColumns = action.payload;
    },

    saveCurCategory(state, action) {
      state.isLoading = false;
      state.currentSelection.category = action.payload;
    },
    saveCurSubCategory(state, action) {
      state.isLoading = false;
      state.currentSelection.subCategory = action.payload;
    },

    saveSubCategories(state, action) {
      state.isLoading = false;
      state.subCategories = action.payload;
    },
    getSelectionSuccess(state, action) {
      state.isLoading = false;
      state.currentSelection.category = action.payload.category;
      state.currentSelection.subCategory = action.payload.subCategory;
    },
    getDataMap(state, action) {
      state.isLoading = false;
      state.currentSelection.currentDsKey = 'ds_1';
      state.currentSelection.dataMap = action.payload;
    },

    fetchdatafeaturemap(state, action) {
      state.isLoading = false;
      state.currentSelection.featureColumns = action.payload;
    },

    updateMappedColumns(state, action) {
      state.currentSelection.mappedColumns = action.payload;
    },

    setCurrentSelectedFeatureMapValues(state, action) {
      state.currentSelection.currentSelectedFeatureMapValues = action.payload;
    },

    currentSelectedFeatureCiColumn(state, action) {
      state.currentSelection.currentSelectedFeatureCiColumn = action.payload;
    },
    getFeatureValueMapVariables(state,action){
        state.currentSelection.currentFeatureValueMapVariables=action.payload
    },

    // GET PRODUCT
    getProductSuccess(state, action) {
      state.isLoading = false;
      state.product = action.payload;
    },

    incrementCurrentDataMap(state, action) {
      state.isLoading = false;
      if(state.currentSelection.currentDataMap<state.currentSelection.dataMap.length){
        // console.log(action.payload)
        if((state.currentSelection.currentDataMap<state.currentSelection.dataMap.length-1) && action.payload>=4){

          state.currentSelection.currentDataMap+=1;
        }else{
          state.currentSelection.dataMap[state.currentSelection.currentDataMap].currentStep+=1;
        }
      }
    },

    changeCurrentDsKey(state, action) {
      state.isLoading = false;
      state.currentSelection.currentDataMap = action.payload - 1;
      state.currentSelection.currentDsKey = `ds_${action.payload}`;
    },
    changeCurrentDataMapState(state, action) {
      state.isLoading = false;
      state.currentSelection.steps = action.payload;
    },

    incrementCurrentState(state, action) {
      state.isLoading = false;
      state.currentSelection.dataMap[state.currentSelection.currentDataMap].currentStep += 1;
    },

    getFeaturevalueMap(state, action) {
      state.isLoading = false;
      state.currentSelection.currentFeatureMapValue = action.payload;
    },
    updateFeatureValueMap(state, action) {
      state.isLoading = false;
      state.currentSelection.currentFeatureMapValue[0][state.currentSelection.currentSelectedFeatureCiColumn] = action.payload;
    },
    

    // CHECKOUT
    getCart(state, action) {
      const cart = action.payload;

      const totalItems = sum(cart.map((product) => product.quantity));
      const subtotal = sum(cart.map((product) => product.price * product.quantity));
      state.checkout.cart = cart;
      state.checkout.discount = state.checkout.discount || 0;
      state.checkout.shipping = state.checkout.shipping || 0;
      state.checkout.billing = state.checkout.billing || null;
      state.checkout.subtotal = subtotal;
      state.checkout.total = subtotal - state.checkout.discount;
      state.checkout.totalItems = totalItems;
    },

    addToCart(state, action) {
      const newProduct = action.payload;
      const isEmptyCart = !state.checkout.cart.length;

      if (isEmptyCart) {
        state.checkout.cart = [...state.checkout.cart, newProduct];
      } else {
        state.checkout.cart = state.checkout.cart.map((product) => {
          const isExisted = product.id === newProduct.id;

          if (isExisted) {
            return {
              ...product,
              colors: uniq([...product.colors, ...newProduct.colors]),
              quantity: product.quantity + 1,
            };
          }

          return product;
        });
      }
      state.checkout.cart = uniqBy([...state.checkout.cart, newProduct], 'id');
      state.checkout.totalItems = sum(state.checkout.cart.map((product) => product.quantity));
    },

    deleteCart(state, action) {
      const updateCart = state.checkout.cart.filter((product) => product.id !== action.payload);

      state.checkout.cart = updateCart;
    },

    resetCart(state) {
      state.checkout.cart = [];
      state.checkout.billing = null;
      state.checkout.activeStep = 0;
      state.checkout.total = 0;
      state.checkout.subtotal = 0;
      state.checkout.discount = 0;
      state.checkout.shipping = 0;
      state.checkout.totalItems = 0;
    },

    backStep(state) {
      state.checkout.activeStep -= 1;
    },

    nextStep(state) {
      state.checkout.activeStep += 1;
    },

    gotoStep(state, action) {
      const step = action.payload;
      state.checkout.activeStep = step;
    },

    increaseQuantity(state, action) {
      const productId = action.payload;

      const updateCart = state.checkout.cart.map((product) => {
        if (product.id === productId) {
          return {
            ...product,
            quantity: product.quantity + 1,
          };
        }
        return product;
      });

      state.checkout.cart = updateCart;
    },

    decreaseQuantity(state, action) {
      const productId = action.payload;
      const updateCart = state.checkout.cart.map((product) => {
        if (product.id === productId) {
          return {
            ...product,
            quantity: product.quantity - 1,
          };
        }
        return product;
      });

      state.checkout.cart = updateCart;
    },

    createBilling(state, action) {
      state.checkout.billing = action.payload;
    },

    applyDiscount(state, action) {
      const discount = action.payload;
      state.checkout.discount = discount;
      state.checkout.total = state.checkout.subtotal - discount;
    },

    applyShipping(state, action) {
      const shipping = action.payload;
      state.checkout.shipping = shipping;
      state.checkout.total = state.checkout.subtotal - state.checkout.discount + shipping;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  getCart,
  addToCart,
  resetCart,
  gotoStep,
  backStep,
  nextStep,
  deleteCart,
  createBilling,
  applyShipping,
  applyDiscount,
  increaseQuantity,
  decreaseQuantity,
  incrementCurrentState,
} = slice.actions;

// ----------------------------------------------------------------------

export function dSourceStatus(projectKey) {
  return async (dispatch) => {
    const response = await axios.get('http://localhost:3000/dsource-status', {
      params: projectKey,
    });
    // console.log(response.data.data.posts);

    dispatch(slice.actions.dSourceStatus(response.data.data.posts[0]));
  };
}
export function changeCurrentDataMapState(value) {
  return (dispatch) => {
    dispatch(slice.actions.changeCurrentDataMapState(value));
  };
}

export function createProject(value) {
  console.log('chal ra h');
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('http://localhost:3000/createproject', value);
      console.log(response.data);
      dispatch(slice.actions.createProject(response.data.data.posts[0]));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getCategory() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('http://localhost:3000/listfsprojects');
      dispatch(slice.actions.getSuccessCategory(response.data.posts));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getDatabase() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('http://localhost:3000/connector-list');
      // console.log(response.data)
      dispatch(slice.actions.getSuccessDbName(response.data.posts));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// form  get data --------------------------------------------------------------

export function getFormFields(dSourceId, dSourceType) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('http://localhost:3000/connector-string', {
        params: { dSourceId, dSourceType },
      });
      console.log(response.data);
      dispatch(slice.actions.getSuccessFormFields(response.data.posts));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function setupConnection(formData, dSourceId) {
  console.log(formData);
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('http://localhost:3000/conn-setup', formData, {
        params: { dSourceId },
      });
      console.log(response.data);
    } catch (error) {
      dispatch(slice.actions.hasError());
    }
  };
}
// -------------------------------------------------------------------------------

export function sendMainData(data, dSourceId) {
  console.log(data);
  return async (dispatch) => {
    const response = await axios.post('http://localhost:3000/tbl-read', data, {
      params: { dSourceId },
    });
    console.log(response.data);
  };
}

//  table data -------------------------------------------------------
export function getTableName(dSourceId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    const response = await axios.get('http://localhost:3000/tbl-lst', { params: { dSourceId } });
    dispatch(slice.actions.saveTableName(response.data.posts.tableNames));
  };
}

export function setSelectedTable(value) {
  return (dispatch) => {
    dispatch(slice.actions.setSelectedTable(value));
  };
}

export function getColumnsNames(dSourceId, table) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    const response = await axios.get('http://localhost:3000/col-lst', {
      params: { dSourceId, table },
    });
    console.log(response.data.posts);
    dispatch(slice.actions.getColumnsNames(response.data.posts));
  };
}

export function saveColumn(value) {
  const sucolumns = sortColumns(value);
  return async (dispatch) => {
    dispatch(slice.actions.saveSelectedColumns(sucolumns.selectedColumns));
    dispatch(slice.actions.saveUnSelectedColumns(sucolumns.unSelectedColumns));
  };
}

export function fetchDataFeatureMap(value) {
  return async (dispatch) => {
    const response = await axios.post('http://localhost:3000/fetchdatafeaturemap');

    dispatch(slice.actions.fetchdatafeaturemap(response.data.posts[0].featureMap.reqdCols));
  };
}

// --------------------------------------------------
export function setDateColName(value) {
  return (dispatch) => {
    dispatch(slice.actions.setDateColName(value));
  };
}
export function setDateColFormat(value) {
  return (dispatch) => {
    dispatch(slice.actions.setDateColFormat(value));
  };
}

export function setCurrentStartDate(value) {
  return (dispatch) => {
    dispatch(slice.actions.setCurrentStartDate(value));
  };
}
export function setCurrentEndDate(value) {
  return (dispatch) => {
    dispatch(slice.actions.setCurrentEndDate(value));
  };
}

export function updateMappedColumns(data){
  // console.log(data)
  return (dispatch)=>{
    dispatch(slice.actions.updateMappedColumns(data))
  }
}

// ---------------------------------------------------------------------
export function saveCurCategory(Curcategory) {
  return (dispatch) => {
    dispatch(slice.actions.startLoading());
    dispatch(slice.actions.saveCurCategory(Curcategory));
  };
}
export function saveCurSubCategory(curSubCategory) {
  // console.log(curSubCategory);
  return (dispatch) => {
    dispatch(slice.actions.startLoading());
    dispatch(slice.actions.saveCurSubCategory(curSubCategory));
  };
}

export function saveSubCategories(subCategories) {
  return (dispatch) => {
    dispatch(slice.actions.startLoading());
    dispatch(slice.actions.saveSubCategories(subCategories));
  };
}

export function saveDataMap(body) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('http://localhost:3000/fetchdatamap', {
        fsProject: body.category,
        fsCategory: body.subCategory,
      });
      const data = modelMapData(response.data.posts);
      // console.log(data);
      dispatch(slice.actions.getDataMap(data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function changeDataMapState(current) {
  // console.log(current)
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      dispatch(slice.actions.incrementCurrentDataMap(current));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function changeCurrentDsKey(value) {
  // console.log(value)
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      dispatch(slice.actions.changeCurrentDsKey(value));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function chnageCurrentDataMapCurrentState(value) {
  // console.log(value)
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      dispatch(slice.actions.chnageCurrentDataMapCurrentState(value));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
// -----------------------------------------------------------------

export function getFeaturevalueMap({value,body}){
  // console.log(value)
  return async (dispatch)=>{
    dispatch(slice.actions.startLoading())
    const response =  await axios.post("http://localhost:3000/fetchpareto",value)
    const fetchvaluemap = await axios.post("http://localhost:3000/fetchdatavaluemap",body)
    const data = response.data.data.posts
    console.log(fetchvaluemap.data.posts)
    console.log(data) 
    dispatch(slice.actions.getFeaturevalueMap(data))
    console.log(value.feature)
    dispatch(slice.actions.currentSelectedFeatureCiColumn(value.feature))
    dispatch(slice.actions.getFeatureValueMapVariables(fetchvaluemap.data.posts))
  }
}

export function updateFeatureValueMap(value) {
  return async (dispatch) => {
    dispatch(slice.actions.updateFeatureValueMap(value));
  };
}

export function setCurrentSelectedFeatureMapValues(value) {
  return (dispatch) => {
    dispatch(slice.actions.setCurrentSelectedFeatureMapValues(value));
  };
}

// ----------------------------------------------------------------------

// utility functions ----------------------------------------------------

const modelMapData = (arr) => {
  const data = arr.map((i) => ({
    ...i,
    // currentStep:0,
  }));
  return data;
};

const sortColumns = (data) => {
  const selectedColumns = [];
  const unSelectedColumns = [];
  data.forEach((element) => {
    if (element.val === true) {
      const currCol = { ...element };
      selectedColumns.push(currCol);
    } else {
      const currCol = { ...element };
      unSelectedColumns.push(currCol);
    }
  });
  const res = { selectedColumns, unSelectedColumns };
  return res;
  // data.forEach(item => {
  //   if(item.val===true){
  //     console.log(Array.isArray(temp.selectedColumns))
  //     temp.selectedColumns.push(item)
  //   }else{
  //     temp.unSelectedColumns.push(item)
  //   }
  // })
  // return temp;
};

// ----------------------------------------------------------------------
