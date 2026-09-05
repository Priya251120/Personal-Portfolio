const API_URL = "https://personal-portfolio-mco3.onrender.com";

// ===============================
// LOAD PROFILE FROM DATABASE
// ===============================
async function loadProfile() {
    try {
        const response = await fetch(`${API_URL}/api/profile`);
        const profile = await response.json();

        console.log("Profile loaded from MySQL:", profile);

        const aboutName = document.getElementById("about-name");
        const aboutDescription = document.getElementById("about-description");

        if (aboutName && profile.name) {
            aboutName.textContent = profile.name;
        }

        if (aboutDescription && profile.description) {
            aboutDescription.textContent = profile.description;
        }

    } catch (error) {
        console.error("Error loading profile:", error);
    }
}

// ===============================
// LOAD PROJECTS FROM DATABASE
// ===============================

async function loadProjects() {
    const container = document.getElementById("projects-container");

    try {
        const response = await fetch(`${API_URL}/api/projects`);
        const projects = await response.json();

        console.log("Projects loaded from MySQL:", projects);

        container.innerHTML = "";

        projects.forEach(project => {

            const card = document.createElement("div");
            card.className = "project-card";

            card.innerHTML = `
                <h3>${project.title}</h3>

                <p>${project.description}</p>

                <p class="technologies">
                    <strong>Technologies:</strong>
                    ${project.technologies}
                </p>

                <div class="project-buttons">

                    ${
                        project.github_url
                        ? `<a href="${project.github_url}" target="_blank">
                            GitHub
                           </a>`
                        : ""
                    }

                    ${
                        project.live_url
                        ? `<a href="${project.live_url}" target="_blank">
                            Live Demo
                           </a>`
                        : ""
                    }

                </div>
            `;

            container.appendChild(card);
        });

    } catch (error) {

        console.error("Error loading projects:", error);

        container.innerHTML = `
            <p>Unable to load projects.</p>
        `;
    }
}


// ===============================
// CONTACT FORM
// ===============================

const contactForm = document.querySelector(".contact-form");

if (contactForm) {

    contactForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const inputs = contactForm.querySelectorAll("input");
        const messageBox = contactForm.querySelector("textarea");

        const data = {
            name: inputs[0].value,
            email: inputs[1].value,
            subject: inputs[2].value,
            message: messageBox.value
        };

        try {

            const response = await fetch(`${API_URL}/api/contact`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {

                alert(result.message);

                contactForm.reset();

            } else {

                alert(result.message);
            }

        } catch (error) {

            console.error("Contact error:", error);

            alert("Unable to connect to the server.");
        }
    });
}


// ===============================
// NAVBAR EFFECT
// ===============================

window.addEventListener("scroll", function() {

    const navbar = document.querySelector(".navbar");

    if (window.scrollY > 50) {

        navbar.style.background = "rgba(3, 12, 25, 0.97)";

    } else {

        navbar.style.background = "rgba(5, 15, 28, 0.92)";
    }
});


// ===============================
// START APPLICATION
// ===============================

loadProfile();
loadProjects();