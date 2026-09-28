/**
 * CYB3RDR4G0N (Rahul Singh) Portfolio Logic
 * Full interactive features: Canvas Cyber Grid, Terminal Console,
 * Synthesizer FX, Project Filtering, Typewriter, and Telemetry.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. Web Audio Synthesizer (Cyber Sound FX)
     ========================================================================== */
  let audioCtx = null;
  let audioEnabled = false;
  const audioToggle = document.getElementById('audioToggle');
  const audioIcon = document.getElementById('audioIcon');

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
  }

  function playSynthSound(freq = 440, type = 'sine', duration = 0.08, gainVal = 0.05) {
    if (!audioEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio fallback silent
    }
  }

  if (audioToggle) {
    audioToggle.addEventListener('click', () => {
      initAudio();
      audioEnabled = !audioEnabled;
      if (audioEnabled) {
        audioIcon.className = 'fa-solid fa-volume-high text-cyan';
        playSynthSound(880, 'triangle', 0.12, 0.08);
      } else {
        audioIcon.className = 'fa-solid fa-volume-xmark text-muted';
      }
    });
  }

  // Play blip on interactive buttons
  document.querySelectorAll('.cyber-btn, .term-quick-cmd, .filter-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => playSynthSound(520, 'sine', 0.04, 0.02));
    btn.addEventListener('click', () => playSynthSound(780, 'triangle', 0.08, 0.04));
  });

  /* ==========================================================================
     2. Interactive HTML5 Canvas Cyber Grid & Constellation
     ========================================================================== */
  const canvas = document.getElementById('cyberCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    });

    const particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 18000), 75);
    const mouse = { x: null, y: null, radius: 120 };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.speedY = (Math.random() - 0.5) * 0.8;
        this.color = Math.random() > 0.4 ? '#00f5d4' : (Math.random() > 0.5 ? '#ff2a85' : '#05ffa1');
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > width) this.speedX *= -1;
        if (this.y < 0 || this.y > height) this.speedY *= -1;

        // Mouse interaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 3;
            this.y -= (dy / dist) * force * 3;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fill();
      }
    }

    function initParticles() {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    initParticles();

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      // Connect nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 245, 212, ${0.18 * (1 - distance / 110)})`;
            ctx.lineWidth = 0.75;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }

  /* ==========================================================================
     3. Typewriter Headline Loop
     ========================================================================== */
  const typewriterText = document.getElementById('typewriterText');
  if (typewriterText) {
    const phrases = [
      'Cybersecurity & Systems Builder',
      'Embedded Hardware & IoT Maker',
      'Defense Tech & Autonomous Platforms',
      'Building Resilient, Secure Software',
      'Architecting for High-Pressure Environments'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 75;
    const deleteSpeed = 40;
    const pauseTime = 1800;

    function typeLoop() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        typewriterText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typewriterText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        setTimeout(typeLoop, pauseTime);
        return;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }

      setTimeout(typeLoop, isDeleting ? deleteSpeed : typeSpeed);
    }

    typeLoop();
  }

  /* ==========================================================================
     4. Real-Time Telemetry Clock (IST / UTC)
     ========================================================================== */
  const hudClock = document.getElementById('hudClock');
  function updateTelemetryClock() {
    if (!hudClock) return;
    const now = new Date();
    // Indian Standard Time format
    const istTime = now.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Kolkata',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    hudClock.textContent = `${istTime} IST`;
  }
  updateTelemetryClock();
  setInterval(updateTelemetryClock, 1000);

  /* ==========================================================================
     5. Interactive Terminal Console Emulator
     ========================================================================== */
  const terminalInput = document.getElementById('terminalInput');
  const terminalOutput = document.getElementById('terminalOutput');
  const termSubmitBtn = document.getElementById('termSubmitBtn');
  const commandHistory = [];
  let historyIndex = -1;

  const terminalCommands = {
    help: () => `
<span class="highlight-cyan">AVAILABLE DIRECTIVES:</span>
  <span class="highlight-green">bio</span>       - View identity dossier and engineering philosophy
  <span class="highlight-green">skills</span>    - Technical proficiencies & arsenal
  <span class="highlight-green">projects</span>  - Index of public repositories & live platforms
  <span class="highlight-green">stats</span>     - GitHub profile metrics & activity
  <span class="highlight-green">contact</span>   - Transmission channels & links
  <span class="highlight-green">whoami</span>    - Current session credentials
  <span class="highlight-green">dragon</span>    - Render dragon sigil
  <span class="highlight-green">clear</span>     - Purge terminal buffer
`,

    bio: () => `
<span class="highlight-cyan">[DOSSIER: RAHUL SINGH // cyb3rdr4g0n17]</span>
• Mission: Building secure, intelligent, and resilient systems for real-world and mission-critical applications.
• Focus: Cybersecurity, Embedded Hardware (Arduino/Raspberry Pi), Autonomous AI Systems, Defense Readiness.
• Philosophy: Security by architecture, zero-trust resilience, low-latency performance.
`,

    skills: () => `
<span class="highlight-cyan">[ARSENAL BREAKDOWN]</span>
• Languages: Python, C/C++, Modern JavaScript, GNU Bash / Shell Scripting, HTML5/CSS3
• Systems & Hardware: Raspberry Pi (3/4/5), Arduino, AVR, Kiosk KVM, Android On-Device SDK
• Security: System Hardening, Network Analysis, OSINT, Threat-aware Architecture
• Deployment & Tooling: Linux (Debian/Arch), Git, Termux, AndroidIDE, Vercel
`,

    projects: () => `
<span class="highlight-cyan">[FEATURED DEPLOYMENTS]</span>
1. <a href="https://ssb-tat-handbook.vercel.app" target="_blank" class="highlight-green">ssb-tat-handbook</a> - Armed Forces SSB TAT psychological preparation platform (Live on Vercel).
2. <a href="https://github.com/cyb3rdr4g0n17/AndroidIDEInstaller" target="_blank" class="highlight-green">AndroidIDEInstaller</a> - Automated on-device Android SDK installer for mobile phones [5 Stars].
3. <a href="https://github.com/cyb3rdr4g0n17/digital-signage" target="_blank" class="highlight-green">digital-signage</a> - Local, zero-internet media platform for Raspberry Pi & Android TV.
4. <a href="https://github.com/cyb3rdr4g0n17/Electronics" target="_blank" class="highlight-green">Electronics</a> - Arduino circuit sketches, drivers, and physical computing.
5. <a href="https://github.com/cyb3rdr4g0n17/open-notebook" target="_blank" class="highlight-green">open-notebook</a> - Open-source alternative to NotebookLM for private knowledge synthesis.
6. <a href="https://github.com/cyb3rdr4g0n17/SmsBomber" target="_blank" class="highlight-green">SmsBomber</a> - Penetration testing & API rate-limiting stress evaluation [4 Stars].
`,

    stats: () => `
<span class="highlight-cyan">[TELEMETRY REPORT]</span>
• Public Repositories: 12
• Key Starred Projects: AndroidIDEInstaller (5★), SmsBomber (4★)
• Primary GitHub URL: https://github.com/cyb3rdr4g0n17
• System State: All nodes active and responding to ping.
`,

    contact: () => `
<span class="highlight-cyan">[TRANSMISSION CHANNELS]</span>
• GitHub: <a href="https://github.com/cyb3rdr4g0n17" target="_blank" class="highlight-green">https://github.com/cyb3rdr4g0n17</a>
• Platform: <a href="https://ssb-tat-handbook.vercel.app" target="_blank" class="highlight-green">https://ssb-tat-handbook.vercel.app</a>
• Collaboration: Open for defense tech, security research, and embedded IoT hardware.
`,

    whoami: () => `
UID: 48344737
User: cyb3rdr4g0n17 (Rahul Singh)
Role: Systems & Security Maker
Access Level: Root Sovereign
`,

    dragon: () => `
<pre class="ascii-dragon" style="margin: 0;">
                __----~~~~~~~~~~~------___
               /                            -~~--_
             _/                             /     ~-
           /                               /        ~-
          /     /                         /           ~-
        /      /                         /             ~-
       /      /                         /               ~-
      /      /                         /                 ~-
     /      /                         /                   ~-
    |      /                         /                     ~-
   /      /                         /                       ~-
  /      /                         /                         ~-
 /      /                         /                           ~-
|      /                         /                             ~-
|     /                         /                               ~-
|    /                         /                                 ~-
 🐉 CYB3RDR4G0N // KNOWLEDGE IS POWER • RESILIENCE IS SHIELD 🐉
</pre>
`
  };

  function executeTerminalCommand(rawInput) {
    const cleanCmd = rawInput.trim().toLowerCase();
    if (!cleanCmd) return;

    commandHistory.push(rawInput);
    historyIndex = commandHistory.length;

    // Append prompt line
    const promptLine = document.createElement('div');
    promptLine.className = 'term-line';
    promptLine.innerHTML = `<span class="term-user-prompt">guest@cyb3rdr4g0n:~$</span> ${escapeHTML(rawInput)}`;
    terminalOutput.appendChild(promptLine);

    playSynthSound(cleanCmd === 'clear' ? 350 : 640, 'triangle', 0.08, 0.05);

    if (cleanCmd === 'clear') {
      terminalOutput.innerHTML = '';
    } else if (terminalCommands[cleanCmd]) {
      const responseLine = document.createElement('div');
      responseLine.className = 'term-line';
      responseLine.innerHTML = terminalCommands[cleanCmd]();
      terminalOutput.appendChild(responseLine);
    } else {
      const errLine = document.createElement('div');
      errLine.className = 'term-line';
      errLine.innerHTML = `<span class="text-red">command not recognized: '${escapeHTML(cleanCmd)}'. Type <span class="highlight-cyan">'help'</span> for list of commands.</span>`;
      terminalOutput.appendChild(errLine);
    }

    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    terminalInput.value = '';
  }

  function escapeHTML(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      playSynthSound(420 + Math.random() * 200, 'sine', 0.02, 0.015);

      if (e.key === 'Enter') {
        executeTerminalCommand(terminalInput.value);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (commandHistory.length > 0 && historyIndex > 0) {
          historyIndex--;
          terminalInput.value = commandHistory[historyIndex];
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          terminalInput.value = commandHistory[historyIndex];
        } else {
          historyIndex = commandHistory.length;
          terminalInput.value = '';
        }
      }
    });

    if (termSubmitBtn) {
      termSubmitBtn.addEventListener('click', () => {
        executeTerminalCommand(terminalInput.value);
        terminalInput.focus();
      });
    }

    // Quick Command Pills
    document.querySelectorAll('.term-quick-cmd').forEach(btn => {
      btn.addEventListener('click', () => {
        const cmd = btn.getAttribute('data-cmd');
        if (cmd) {
          executeTerminalCommand(cmd);
          terminalInput.focus();
        }
      });
    });
  }

  /* ==========================================================================
     6. Projects Category Filter
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (filterVal === 'all' || cardCat === filterVal) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ==========================================================================
     7. Contact Transmission Simulator
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName').value;
      const email = document.getElementById('contactEmail').value;
      const message = document.getElementById('contactMessage').value;

      playSynthSound(900, 'triangle', 0.15, 0.08);

      formFeedback.innerHTML = `
        <span class="text-cyan"><i class="fa-solid fa-spinner fa-spin"></i> ENCRYPTING 256-BIT PAYLOAD & DISPATCHING TO DRAGON RELAY...</span>
      `;

      setTimeout(() => {
        playSynthSound(1050, 'sine', 0.2, 0.09);
        formFeedback.innerHTML = `
          <span class="text-green"><i class="fa-solid fa-check"></i> TRANSMISSION DELIVERED TO RAHUL SINGH. STATUS: RECEIVED.</span>
        `;
        contactForm.reset();

        // Also echo into terminal if visible
        const echoLine = document.createElement('div');
        echoLine.className = 'term-line';
        echoLine.innerHTML = `<span class="highlight-green">[SYSTEM_NOTIFICATION] Transmission payload from '${escapeHTML(name)}' (${escapeHTML(email)}) safely registered in local logs.</span>`;
        if (terminalOutput) {
          terminalOutput.appendChild(echoLine);
          terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }
      }, 1200);
    });
  }

  /* ==========================================================================
     8. Mobile Navigation & Header Scroll State
     ========================================================================== */
  const topNav = document.getElementById('topNav');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      topNav.classList.add('scrolled');
    } else {
      topNav.classList.remove('scrolled');
    }
  });

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      playSynthSound(600, 'sine', 0.05, 0.03);
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  /* ==========================================================================
     9. Interactive 3D Tilt for HUD Avatar Card
     ========================================================================== */
  const hudCard = document.getElementById('hudCard');
  if (hudCard && window.innerWidth > 992) {
    hudCard.addEventListener('mousemove', (e) => {
      const rect = hudCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;
      hudCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    hudCard.addEventListener('mouseleave', () => {
      hudCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  }

  console.log("%cλ_CYB3RDR4G0N SYSTEM V2.6 ONLINE", "color: #00f5d4; font-family: monospace; font-size: 16px; font-weight: bold; background: #07090e; padding: 6px;");
});
