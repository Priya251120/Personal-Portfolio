const API_URL = "https://personal-portfolio-mco3.onrender.com";

// ===============================
// LOAD PROFILE FROM DATABASE
// ===============================

async function loadProfile() {
    try {
        const response = await fetch(`${API_URL}/api/profile`);

        if (!response.ok) {
            throw new Error("Failed to load profile");
        }

        const profile = await response.json();

        console.log("Profile loaded from MySQL:", profile);

        // Update About section name
        const aboutName = document.querySelector("#about h3");

        if (aboutName && profile.name) {
            aboutName.textContent = profile.name;
        }

        // Update About section role
        const aboutRole = document.querySelector("#about h4");

        if (aboutRole && profile.role) {
            aboutRole.textContent = profile.role;
        }

        // Update About section description
        const aboutDescription = document.querySelector("#about p");

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

    if (!container) {
        console.error("Projects container not found.");
        return;
    }

    try {

        // Show loading message
        container.innerHTML = "<p>Loading projects...</p>";

        const response = await fetch(`${API_URL}/api/projects`);

        if (!response.ok) {
            throw new Error("Failed to load projects");
        }

        const projects = await response.json();

        console.log("Projects loaded from MySQL:", projects);

        // Check if projects exist
        if (!Array.isArray(projects) || projects.length === 0) {
            container.innerHTML = "<p>No projects available.</p>";
            return;
        }

        // Clear loading message
        container.innerHTML = "";

        projects.forEach(project => {

            const card = document.createElement("div");

            card.className = "project-card";

            // Safely get project information
            const title = project.title || "Untitled Project";

            const description =
                project.description || "No description available.";

            const technologies =
                project.technologies || "Not specified";

            const githubUrl =
                project.github_url || "";

            const liveUrl =
                project.live_url || "";

            // Create project card
            card.innerHTML = `
                <h3>${title}</h3>

                <p>${description}</p>

                <p class="technologies">
                    <strong>Technologies:</strong>
                    ${technologies}
                </p>

                <div class="project-buttons">

                    ${
                        githubUrl && githubUrl !== "#"
                        ? `
                            <a href="${githubUrl}" target="_blank" rel="noopener noreferrer">
                                GitHub
                            </a>
                          `
                        : ""
                    }

                    ${
                        liveUrl && liveUrl !== "#"
                        ? `
                            <a href="${liveUrl}" target="_blank" rel="noopener noreferrer">
                                Live Demo
                            </a>
                          `
                        : ""
                    }

                </div>
            `;

            container.appendChild(card);
        });

    } catch (error) {

        console.error("Error loading projects:", error);

        container.innerHTML = `
            <p>Unable to load projects. Please try again later.</p>
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

            if (!response.ok) {
                throw new Error("Failed to send message");
            }

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

    if (!navbar) {
        return;
    }

    if (window.scrollY > 50) {

        navbar.style.background =
            "rgba(3, 12, 25, 0.97)";

    } else {

        navbar.style.background =
            "rgba(5, 15, 28, 0.92)";
    }
});


// ===============================
// START APPLICATION
// ===============================

loadProfile();
loadProjects();
