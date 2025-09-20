let taxSwitch = document.getElementById("flexSwitchCheckDefault");
taxSwitch.addEventListener("click", () => {
  let taxinfo = document.getElementsByClassName("tax-info");
  for(info of taxinfo) {
    if(info.style.display != "inline"){
      info.style.display = "inline";
    } else {
      info.style.display = "none"
    }
  }
})



let filtersMenu = document.getElementsByClassName("filters-menu")[0];

function toggleFiltersMenu() {
  if(window.innerWidth < 1200) {
    filtersMenu.style.display = "block"
  } 
  if(window.innerWidth > 1200) {
    filtersMenu.style.display = "none"
  }
}

toggleFiltersMenu();
window.addEventListener("resize", toggleFiltersMenu);
