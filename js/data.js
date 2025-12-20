export function getRecords(){
  return JSON.parse(localStorage.getItem("records")) || [];
}

export function saveRecords(r){
  localStorage.setItem("records", JSON.stringify(r));
}
