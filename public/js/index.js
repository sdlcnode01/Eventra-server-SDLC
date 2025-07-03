document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.getElementById("sidebar-toggle");
  const sidebar = document.getElementById("sidebar");
  const test = document.getElementById('test-sidebar');
  toggleBtn.addEventListener("click", function () {
    sidebar.classList.toggle("active");
    // console.log(toggleBtn.children);
    test.children[0].classList.toggle("close");
    
    // toggleBtn.classList.toggle("collapse");
  });
});