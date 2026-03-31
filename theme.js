const savedTheme = localStorage.getItem('simple-checklist-theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

document.addEventListener("DOMContentLoaded", () => {
    const themeToggleBtn = document.getElementById("themeToggleBtn");
    const themeIcon = document.getElementById("themeIcon");

    if (themeToggleBtn && themeIcon) {
        if (savedTheme === 'dark') {
            themeIcon.src = "assets/sun.svg";
        }

        themeToggleBtn.addEventListener("click", () => {
            const currentTheme = document.documentElement.getAttribute("data-theme");
            const newTheme = currentTheme === "light" ? "dark" : "light";
            
            document.documentElement.setAttribute("data-theme", newTheme);
            localStorage.setItem("simple-checklist-theme", newTheme);
            
            themeIcon.src = newTheme === "dark" ? "assets/sun.svg" : "assets/moon.svg";
        });
    }
});