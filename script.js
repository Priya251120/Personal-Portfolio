const API_URL = "https://personal-portfolio-mco3.onrender.com";


// =====================================================
// LOAD PROFILE FROM DATABASE
// =====================================================

async function loadProfile() {

    try {

        const response = await fetch(`${API_URL}/api/profile`);

        if (!response.ok) {
            throw new Error("Failed to load profile");
        }

        const profile = await response.json();

        console.log("Profile loaded from MySQL:", profile);


        // ---------------------------------------------
        // ABOUT NAME
        // ---------------------------------------------

        const aboutName =
            document.getElementById("about-name");

        if (aboutName) {
            aboutName.textContent =
                profile.name || "Priyadharsini R";
        }


        // ---------------------------------------------
        // ABOUT ROLE
        // ---------------------------------------------

        const aboutRole =
            document.getElementById("about-role");

        if (aboutRole) {
            aboutRole.textContent =
                profile.role || "AI & Cloud Enthusiast";
        }

    }

    catch (error) {

        console.error(
            "Error loading profile:",
            error
        );

    }

}



// =====================================================
// LOAD PROJECTS FROM DATABASE
// =====================================================

async function loadProjects() {

    const container =
        document.getElementById("projects-container");


    if (!container) {

        console.error(
            "Projects container not found."
        );

        return;
    }


    try {

        // Show loading message

        container.innerHTML =
            "<p>Loading projects...</p>";


        // Get projects from backend

        const response =
            await fetch(`${API_URL}/api/projects`);


        if (!response.ok) {

            throw new Error(
                "Failed to load projects"
            );

        }


        // Convert response to JSON

        const projects =
            await response.json();


        console.log(
            "Projects loaded from MySQL:",
            projects
        );


        // Check whether projects exist

        if (
            !Array.isArray(projects) ||
            projects.length === 0
        ) {

            container.innerHTML =
                "<p>No projects available.</p>";

            return;
        }


        // Clear loading message

        container.innerHTML = "";


        // Create project cards

        projects.forEach(project => {

            const card =
                document.createElement("div");


            card.className =
                "project-card";


            // -----------------------------------------
            // PROJECT TITLE
            // -----------------------------------------

            const title =
                project.title ||
                "Untitled Project";


            // -----------------------------------------
            // PROJECT DESCRIPTION
            // -----------------------------------------

            const description =
                project.description ||
                project.discription ||
                "No description available.";


            // -----------------------------------------
            // TECHNOLOGIES
            // -----------------------------------------

            const technologies =
                project.technologies ||
                project.tech ||
                "Not specified";


            // -----------------------------------------
            // GITHUB URL
            // -----------------------------------------

            const githubUrl =
                project.github_url ||
                "";


            // -----------------------------------------
            // LIVE DEMO URL
            // -----------------------------------------

            const liveUrl =
                project.live_url ||
                "";


            // -----------------------------------------
            // CREATE PROJECT CARD
            // -----------------------------------------

            card.innerHTML = `

                <h3>
                    ${title}
                </h3>

                <p>
                    ${description}
                </p>

                <p class="technologies">

                    <strong>
                        Technologies:
                    </strong>

                    ${technologies}

                </p>

                <div class="project-buttons">

                    ${
                        githubUrl &&
                        githubUrl !== "#"
                        ?
                        `
                        <a
                            href="${githubUrl}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            GitHub
                        </a>
                        `
                        :
                        ""
                    }


                    ${
                        liveUrl &&
                        liveUrl !== "#"
                        ?
                        `
                        <a
                            href="${liveUrl}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Live Demo
                        </a>
                        `
                        :
                        ""
                    }

                </div>

            `;


            // Add card to page

            container.appendChild(card);

        });

    }


    catch (error) {

        console.error(
            "Error loading projects:",
            error
        );


        container.innerHTML = `

            <p>
                Unable to load projects.
                Please try again later.
            </p>

        `;

    }

}



// =====================================================
// CONTACT FORM
// =====================================================

const contactForm =
    document.querySelector(".contact-form");


if (contactForm) {

    contactForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            // Get form inputs

            const inputs =
                contactForm.querySelectorAll("input");


            const messageBox =
                contactForm.querySelector("textarea");


            // Prepare form data

            const data = {

                name:
                    inputs[0].value,

                email:
                    inputs[1].value,

                subject:
                    inputs[2].value,

                message:
                    messageBox.value

            };


            try {

                // Send data to backend

                const response =
                    await fetch(
                        `${API_URL}/api/contact`,
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(data)

                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "Failed to send message"
                    );

                }


                // Get server response

                const result =
                    await response.json();


                if (result.success) {

                    alert(
                        result.message
                    );


                    // Clear form

                    contactForm.reset();

                }

                else {

                    alert(
                        result.message
                    );

                }

            }


            catch (error) {

                console.error(
                    "Contact error:",
                    error
                );


                alert(
                    "Unable to connect to the server."
                );

            }

        }
    );

}



// =====================================================
// NAVBAR SCROLL EFFECT
// =====================================================

window.addEventListener(
    "scroll",
    function() {

        const navbar =
            document.querySelector(".navbar");


        if (!navbar) {
            return;
        }


        if (window.scrollY > 50) {

            navbar.style.background =
                "rgba(3, 12, 25, 0.97)";

        }

        else {

            navbar.style.background =
                "rgba(5, 15, 28, 0.92)";

        }

    }
);



// =====================================================
// START APPLICATION
// =====================================================

loadProfile();

loadProjects();