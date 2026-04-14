const savedTheme = localStorage.getItem('simple-checklist-theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

document.addEventListener("DOMContentLoaded", () => {
    const themeToggleBtns = document.querySelectorAll(".themeToggleBtn");
    const themeIcons = document.querySelectorAll(".themeIcon");

    if (themeToggleBtns.length > 0) {
        if (savedTheme === 'dark') {
            themeIcons.forEach(icon => icon.src = "assets/sun.svg");
        }

        themeToggleBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const currentTheme = document.documentElement.getAttribute("data-theme");
                const newTheme = currentTheme === "light" ? "dark" : "light";
                
                document.documentElement.setAttribute("data-theme", newTheme);
                localStorage.setItem("simple-checklist-theme", newTheme);
                
                themeIcons.forEach(icon => icon.src = newTheme === "dark" ? "assets/sun.svg" : "assets/moon.svg");
            });
        });
    }
});