// Load content from JSON file
async function loadContent() {
    try {
        const response = await fetch('content.json');
        const data = await response.json();

        // Populate all sections
        populateHero(data.hero);
        populateAbout(data.about);
        populateExperience(data.experience);
        populateEducation(data.education);
        populateCertifications(data.certifications);
        populateProjects(data.projects);
        populateContact(data.contact);

        console.log('✅ Content loaded successfully');
    } catch (error) {
        console.error('❌ Error loading content:', error);
    }
}

function populateHero(hero) {
    const terminalText = document.querySelector('.terminal-text');
    const glitchTitle = document.querySelector('.glitch');
    const subtitle = document.querySelector('#hero h2');
    const description = document.querySelector('#hero .subtitle');

    if (terminalText) terminalText.innerHTML = `<span class="prompt">></span> ${hero.greeting}`;
    if (glitchTitle) {
        glitchTitle.textContent = hero.title;
        glitchTitle.setAttribute('data-text', hero.title);
    }
    if (subtitle) subtitle.textContent = hero.subtitle;
    if (description) description.textContent = hero.description;
}

function populateAbout(about) {
    const textBlock = document.querySelector('.text-block');
    const statsBlock = document.querySelector('.stats-block');

    if (textBlock) {
        textBlock.innerHTML = about.paragraphs.map(p => `<p>${p}</p>`).join('');
    }

    if (statsBlock) {
        statsBlock.innerHTML = about.stats.map(stat => `
            <div class="stat">
                <span class="number">${stat.number}</span>
                <span class="label">${stat.label}</span>
            </div>
        `).join('');
    }
}

function populateExperience(experience) {
    const timeline = document.querySelector('.timeline');

    if (timeline) {
        timeline.innerHTML = experience.map(job => `
            <div class="timeline-item">
                <div class="timeline-date">${job.date}</div>
                <div class="timeline-content">
                    <h4>${job.title} <span class="job-type ${job.type.toLowerCase().replace(/[^a-z]/g, '-')}">${job.type}</span></h4>
                    <div class="company">${job.company}</div>
                    <p>${job.description}</p>
                </div>
            </div>
        `).join('');
    }
}

function populateEducation(education) {
    const educationGrid = document.querySelector('.education-grid');

    if (educationGrid) {
        educationGrid.innerHTML = education.map(edu => `
            <div class="edu-card">
                <div class="edu-icon">${edu.icon}</div>
                <h4>${edu.degree}</h4>
                <p class="degree">${edu.program}</p>
                <p class="school">${edu.school}</p>
                ${edu.wesLink ? `
                    <a href="${edu.wesLink}" target="_blank" rel="noopener noreferrer" class="wes-link">
                        🎓 View WES Certification
                    </a>
                ` : ''}
            </div>
        `).join('');
    }
}

function populateCertifications(certifications) {
    const certGrid = document.querySelector('.cert-grid');

    if (certGrid) {
        certGrid.innerHTML = certifications.map(cert => `
            <div class="cert-card">
                <div class="cert-icon">${cert.icon}</div>
                <div class="cert-content">
                    <h5>${cert.title}</h5>
                    <p class="cert-description">${cert.description}</p>
                    <div class="cert-provider">
                        ${cert.providers.map(provider =>
            `<span class="provider-badge ${provider.class}">${provider.name}</span>`
        ).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function populateProjects(projects) {
    const projectsGrid = document.querySelector('.projects-grid');

    if (projectsGrid) {
        projectsGrid.innerHTML = projects.map(project => `
            <div class="project-card">
                <div class="card-header">
                    <span class="folder-icon">📁</span>
                    <div class="links">
                        <a href="${project.githubUrl}" target="_blank">View Code</a>
                        <a href="${project.detailsUrl}" target="_blank">Details</a>
                    </div>
                </div>
                <h4>${project.title}</h4>
                <p>${project.description}</p>
                <ul class="tags">
                    ${project.tags.map(tag => `<li>${tag}</li>`).join('')}
                </ul>
            </div>
        `).join('');
    }
}

function populateContact(contact) {
    const contactDescription = document.querySelector('.contact-content > p');
    const contactForm = document.getElementById('contact-form');
    const directEmailLink = document.querySelector('.contact-links a[href^="mailto"]');
    const githubLink = document.querySelector('.contact-links a[href*="github"]');

    if (contactDescription) contactDescription.textContent = contact.description;
    if (contactForm) contactForm.setAttribute('action', contact.formAction);
    if (directEmailLink) directEmailLink.setAttribute('href', `mailto:${contact.email}`);
    if (githubLink) githubLink.setAttribute('href', contact.github);

    // Update footer social links
    const footerEmail = document.querySelector('footer a[href^="mailto"]');
    const footerGithub = document.querySelector('footer a[href*="github"]');
    const footerLinkedin = document.querySelector('footer a[href*="linkedin"]');

    if (footerEmail) footerEmail.setAttribute('href', `mailto:${contact.email}`);
    if (footerGithub) footerGithub.setAttribute('href', contact.github);
    if (footerLinkedin) footerLinkedin.setAttribute('href', contact.linkedin);
}

// Call loadContent when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    loadContent();
});
