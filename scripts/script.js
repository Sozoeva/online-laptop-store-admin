const cartModal = document.querySelector(".cartModal");
const addLaptopModalCloseBtn = document.querySelector(".cartCloseBtn");
const addBtn = document.querySelector(".addLaptopBtn");
const cardsRoot = document.querySelector(".cards");
const formItems = document.getElementsByClassName("formItem");
const modalAddBtn = document.querySelector(".modalAddBtn");

const MAIN_URL = "http://localhost:8080";

let isEdit = false;
let selectedId = null;

const openAddLaptopModal = () => cartModal.classList.remove("cartModalHidden");

addBtn.onclick = openAddLaptopModal;

const closeAddLaptopModal = () => {
  cartModal.classList.add("cartModalHidden");
  [...formItems].forEach((formItem) => {
    formItem.value = "";
  });
};

addLaptopModalCloseBtn.onclick = closeAddLaptopModal;

const getLaptops = async () => {
  try {
    const { data } = await axios.get(`${MAIN_URL}/laptops`);
    renderLaptops(data);
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};

const renderLaptops = (data) => {
  cardsRoot.innerHTML = "";

  data.forEach((laptop) => {
    const div = document.createElement("div");
    div.classList.add("card");

    const { id, name, image, price } = laptop;

    div.innerHTML = `
            <h2>${name}</h2>
            <p>${price}</p>
            <img src="${image}" alt="${name}">
        `;

    const deletBtn = document.createElement("button");
    deletBtn.classList.add("deletBtn");
    deletBtn.innerHTML = "Delete";
    deletBtn.onclick = () => {
      deletCard(id);
    };

    const editBtn = document.createElement("button");
    editBtn.classList.add("editBtn");
    editBtn.innerHTML = "Edit";
    editBtn.onclick = () => {
      editCard(id);
    };

    div.append(deletBtn);
    div.append(editBtn);
    cardsRoot.append(div);
  });
};

const addNewLaptop = async (event) => {
  event.preventDefault();
  const data = [...formItems].reduce((acc, formItem) => {
    acc[formItem.name] = formItem.value;
    return acc;
  }, {});

  const url = `${MAIN_URL}/laptops${isEdit ? `/${selectedId}` : ""}`;

  try {
    await axios[isEdit ? "patch" : "post"](url, {
      ...data,
      "win-code": 1.2312312312487237e24,
    });
    getLaptops();
    closeAddLaptopModal();
    isEdit = false;
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};

modalAddBtn.onclick = addNewLaptop;

const deletCard = async (id) => {
  try {
    await axios.delete(`${MAIN_URL}/laptops/${id}`);
    getLaptops();
  } catch (error) {
    alert(error.message);
    console.error(error);
  }
};

const getlaptopById = async (id) => {
  try {
    const { data } = await axios.get(`${MAIN_URL}/laptops/${id}`);
    return data;
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};

const editCard = async (id) => {
  isEdit = true;
  selectedId = id;
  const data = await getlaptopById(id);

  console.log(Object.keys(data), "data keys");

  Object.keys(data).forEach((item) => {
    const formElement = document.querySelector(`*[name=${item}]`);
    if (formElement) {
      formElement.value = data[item];
    }
  });
  openAddLaptopModal();
};

getLaptops();
