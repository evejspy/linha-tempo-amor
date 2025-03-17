document.addEventListener('DOMContentLoaded', function() {
    // Variáveis globais
    let memories = [
        {
            id: 1,
            date: '01/01/2023',
            title: 'Nosso primeiro encontro',
            description: 'Aquele dia especial em que nos conhecemos no café...',
            imageUrl: '' // Será preenchido quando o usuário fazer upload
        }
    ];
    let currentSlide = 0;
    let timelinePassword = '';
    
    // Elementos DOM
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const viewerTab = document.getElementById('viewerTab');
    const addMemoryBtn = document.getElementById('addMemoryBtn');
    const memoryList = document.getElementById('memoryList');
    const generateBtn = document.getElementById('generateBtn');
    const timelineContainer = document.getElementById('timelineContainer');
    const timelineLink = document.getElementById('timelineLink');
    const copyBtn = document.getElementById('copyBtn');
    const passwordProtect = document.getElementById('passwordProtect');
    const passwordModal = document.getElementById('passwordModal');
    const passwordInput = document.getElementById('passwordInput');
    const passwordSubmit = document.getElementById('passwordSubmit');
    const passwordError = document.getElementById('passwordError');
    
    // Alternar entre abas
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.dataset.tab;
            
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(`${tabId}Tab`).classList.add('active');
        });
    });
    
    // Adicionar novo momento
    addMemoryBtn.addEventListener('click', addNewMemory);
    
    function addNewMemory() {
        const newId = memories.length ? Math.max(...memories.map(m => m.id)) + 1 : 1;
        
        const memory = {
            id: newId,
            date: formatDate(new Date()),
            title: 'Novo momento',
            description: 'Descreva este momento especial...',
            imageUrl: ''
        };
        
        memories.push(memory);
        renderMemories();
    }
    
    // Renderizar lista de memórias
    function renderMemories() {
        memoryList.innerHTML = '';
        
        memories.forEach(memory => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.id = memory.id;
            
            card.innerHTML = `
                <div class="memory-img-container">
                    ${memory.imageUrl ? 
                        `<img src="${memory.imageUrl}" class="memory-img" alt="${memory.title}">` : 
                        '<span class="memory-upload-icon">📷</span>'}
                    <input type="file" class="file-upload" accept="image/*" id="file-${memory.id}">
                    <label class="file-upload-label" for="file-${memory.id}"></label>
                </div>
                <div class="memory-details">
                    <div class="memory-date">${memory.date}</div>
                    <h3 class="memory-name">${memory.title}</h3>
                    <p class="memory-description">${memory.description}</p>
                </div>
                <div class="memory-actions">
                    <button class="memory-action-btn edit-memory" data-id="${memory.id}">✏️</button>
                    <button class="memory-action-btn delete-memory" data-id="${memory.id}">🗑️</button>
                </div>
            `;
            
            memoryList.appendChild(card);
            
            // Adicionar event listener para upload de arquivo
            const fileInput = card.querySelector(`#file-${memory.id}`);
            fileInput.addEventListener('change', (e) => {
                handleImageUpload(e, memory.id);
            });
            
            // Adicionar event listeners para editar e excluir
            card.querySelector('.edit-memory').addEventListener('click', () => {
                editMemory(memory.id);
            });
            
            card.querySelector('.delete-memory').addEventListener('click', () => {
                deleteMemory(memory.id);
            });
        });
    }
    
    // Manipular upload de imagem
    function handleImageUpload(event, memoryId) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const memory = memories.find(m => m.id === memoryId);
            if (memory) {
                memory.imageUrl = e.target.result;
                renderMemories();
            }
        };
        reader.readAsDataURL(file);
    }
    
    // Editar memória
    function editMemory(id) {
        const memory = memories.find(m => m.id === id);
        if (!memory) return;
        
        // Criar modal para edição
        const modal = document.createElement('div');
        modal.className = 'edit-modal';
        modal.innerHTML = `
            <div class="edit-container">
                <h2>Editar Momento</h2>
                <div class="form-group">
                    <label>Data</label>
                    <input type="text" id="edit-date" value="${memory.date}">
                </div>
                <div class="form-group">
                    <label>Título</label>
                    <input type="text" id="edit-title" value="${memory.title}">
                </div>
                <div class="form-group">
                    <label>Descrição</label>
                    <textarea id="edit-description">${memory.description}</textarea>
                </div>
                <div class="edit-actions">
                    <button class="cancel-btn">Cancelar</button>
                    <button class="save-btn">Salvar</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Event listeners para botões
        modal.querySelector('.cancel-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.querySelector('.save-btn').addEventListener('click', () => {
            memory.date = modal.querySelector('#edit-date').value;
            memory.title = modal.querySelector('#edit-title').value;
            memory.description = modal.querySelector('#edit-description').value;
            renderMemories();
            document.body.removeChild(modal);
        });
    }
    
    // Excluir memória
    function deleteMemory(id) {
        if (confirm('Tem certeza que deseja excluir este momento?')) {
            memories = memories.filter(m => m.id !== id);
            renderMemories();
        }
    }
    
    // Formatar data atual
    function formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
    
    // Gerar linha do tempo
    generateBtn.addEventListener('click', () => {
        if (memories.length < 1) {
            alert('Adicione pelo menos um momento para gerar sua linha do tempo!');
            return;
        }
        
        const recipientName = document.getElementById('recipientName').value;
        const finalMessage = document.getElementById('finalMessage').value;
        
        if (!recipientName) {
            alert('Por favor, adicione o nome da pessoa especial!');
            return;
        }
        
        // Mostrar aba de link
        document.querySelector('[data-tab="link"]').click();
        
        // Gerar um ID único para a linha do tempo
        const timelineId = generateUniqueId();
        
        // Atualizar o link
        timelineLink.textContent = `${window.location.origin}${window.location.pathname}?id=${timelineId}`;
        
        // Salvar dados na localStorage (em uma aplicação real, seria salvo no servidor)
        saveTimelineData(timelineId, {
            recipientName,
            finalMessage,
            memories: [...memories]
        });
        
        // Mostrar aba de visualização para testes
        viewerTab.style.display = 'block';
    });
    
    // Gerar ID único
    function generateUniqueId() {
        return 'xxxxxxxxxxxx'.replace(/[x]/g, c => {
            const r = Math.floor(Math.random() * 16);
            return r.toString(16);
        });
    }
    
    // Salvar dados da linha do tempo
    function saveTimelineData(id, data) {
        localStorage.setItem(`timeline-${id}`, JSON.stringify(data));
    }
    
    // Copiar link para a área de transferência
    copyBtn.addEventListener('click', () => {
        const linkText = timelineLink.textContent;
        navigator.clipboard.writeText(linkText)
            .then(() => {
                copyBtn.textContent = '✓';
                setTimeout(() => {
                    copyBtn.textContent = '📋';
                }, 2000);
            })
            .catch(err => {
                console.error('Erro ao copiar: ', err);
            });
    });
    
    // Verificar se há um parâmetro de linha do tempo na URL
    function checkForTimelineInUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const timelineId = urlParams.get('id');
        
        if (timelineId) {
            // Tentar carregar a linha do tempo
            const timelineData = loadTimelineData(timelineId);
            
            if (timelineData) {
                // Verificar se tem senha
                if (timelineData.password && timelineData.password !== '') {
                    showPasswordModal(timelineId, timelineData);
                } else {
                    showTimeline(timelineData);
                }
            }
        }
    }
    
    // Mostrar modal de senha
    function showPasswordModal(timelineId, timelineData) {
        passwordModal.classList.add('active');
        
        passwordSubmit.addEventListener('click', () => {
            const password = passwordInput.value;
            
            if (password === timelineData.password) {
                passwordModal.classList.remove('active');
                showTimeline(timelineData);
            } else {
                passwordError.style.display = 'block';
            }
        });
    }
    
    // Carregar dados da linha do tempo
    function loadTimelineData(id) {
        const data = localStorage.getItem(`timeline-${id}`);
        return data ? JSON.parse(data) : null;
    }
    
    // Mostrar a linha do tempo
    function showTimeline(data) {
        // Mostrar a aba de visualização
        viewerTab.style.display = 'block';
        document.querySelector('[data-tab="viewer"]').click();
        
        // Limpar o container
        timelineContainer.innerHTML = '';
        
        // Adicionar slides para cada memória
        data.memories.forEach((memory, index) => {
            const slide = document.createElement('div');
            slide.className = `timeline-slide ${index === 0 ? 'active' : ''}`;
            
            if (memory.imageUrl) {
                slide.style.backgroundImage = `url(${memory.imageUrl})`;
            } else {
                slide.style.backgroundColor = '#000';
            }
            
            slide.innerHTML = `
                <div class="slide-overlay"></div>
                <div class="slide-content">
                    <div class="slide-date">${memory.date}</div>
                    <h2 class="slide-title">${memory.title}</h2>
                    <p class="slide-description">${memory.description}</p>
                </div>
            `;
            
            timelineContainer.appendChild(slide);
        });
        
        // Adicionar slide final com mensagem
        const finalSlide = document.createElement('div');
        finalSlide.className = 'timeline-slide';
        finalSlide.innerHTML = `
            <div class="slide-overlay"></div>
            <div class="timeline-final-slide">
                <div class="heart-animation">❤️</div>
                <h2 class="final-message">${data.finalMessage || 'Te amo para sempre!'}</h2>
                <p class="slide-description">Para ${data.recipientName}, com todo meu amor.</p>
                <button class="timeline-back-btn" id="restartTimeline">Ver novamente</button>
            </div>
        `;
        
        // Adicionar corações flutuantes no slide final
        const floatingHearts = document.createElement('div');
        floatingHearts.className = 'floating-hearts';
        
        for (let i = 0; i < 20; i++) {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.textContent = '❤️';
            
            heart.style.left = `${Math.random() * 100}%`;
            heart.style.top = `${Math.random() * 100}%`;
            heart.style.animationDuration = `${Math.random() * 5 + 5}s`;
            heart.style.fontSize = `${Math.random() * 20 + 10}px`;
            
            floatingHearts.appendChild(heart);
        }
        
        finalSlide.appendChild(floatingHearts);
        timelineContainer.appendChild(finalSlide);
        
        // Adicionar controles de navegação
        addTimelineControls(data.memories.length + 1);
        
        // Iniciar apresentação automática
        startTimelinePresentation();
    }
    
    // Adicionar controles de navegação
    function addTimelineControls(slidesCount) {
        // Adicionar pontos de navegação
        const nav = document.createElement('div');
        nav.className = 'timeline-nav';
        
        for (let i = 0; i < slidesCount; i++) {
            const dot = document.createElement('div');
            dot.className = `timeline-dot ${i === 0 ? 'active' : ''}`;
            dot.dataset.slide = i;
            
            dot.addEventListener('click', () => {
                goToSlide(i);
            });
            
            nav.appendChild(dot);
        }
        
        timelineContainer.appendChild(nav);
        
        // Adicionar botões de navegação
        const controls = document.createElement('div');
        controls.className = 'timeline-controls';
        controls.innerHTML = `
            <button class="timeline-control-btn prev">◀</button>
            <button class="timeline-control-btn next">▶</button>
        `;
        
        timelineContainer.appendChild(controls);
        
        // Event listeners para navegação
        controls.querySelector('.prev').addEventListener('click', prevSlide);
        controls.querySelector('.next').addEventListener('click', nextSlide);
        
        // Evento para o botão "Ver novamente"
        setTimeout(() => {
            const restartBtn = document.getElementById('restartTimeline');
            if (restartBtn) {
                restartBtn.addEventListener('click', () => {
                    goToSlide(0);
                });
            }
        }, 1000);
    }
    
    // Ir para um slide específico
    function goToSlide(index) {
        const slides = timelineContainer.querySelectorAll('.timeline-slide');
        const dots = timelineContainer.querySelectorAll('.timeline-dot');
        
        if (index < 0) index = 0;
        if (index >= slides.length) index = slides.length - 1;
        
        currentSlide = index;
        
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }
    
    // Ir para o slide anterior
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }
    
    // Ir para o próximo slide
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }
    
    // Iniciar apresentação automática
    function startTimelinePresentation() {
        const slides = timelineContainer.querySelectorAll('.timeline-slide');
        let autoplayInterval;
        
        function startAutoplay() {
            autoplayInterval = setInterval(() => {
                if (currentSlide < slides.length - 1) {
                    nextSlide();
                } else {
                    clearInterval(autoplayInterval);
                }
            }, 5000); // Mudar slide a cada 5 segundos
        }
        
        startAutoplay();
        
        // Pausar quando o usuário interagir
        timelineContainer.addEventListener('click', () => {
            clearInterval(autoplayInterval);
        });
    }
    
    // Proteção com senha
    passwordProtect.addEventListener('change', () => {
        // Em uma aplicação real, você armazenaria a senha de forma segura
        timelinePassword = passwordProtect.value;
        
        // Atualizar o último timeline salvo com a senha
        const timelineId = timelineLink.textContent.split('/').pop();
        const timelineData = loadTimelineData(timelineId);
        
        if (timelineData) {
            timelineData.password = timelinePassword;
            saveTimelineData(timelineId, timelineData);
        }
    });
    
    // Verificar URL ao carregar a página
    window.addEventListener('load', () => {
        checkForTimelineInUrl();
        renderMemories(); // Renderizar lista inicial
    });
    
    // Adicionar compartilhamento em redes sociais
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const link = timelineLink.textContent;
            const message = `Criei uma linha do tempo especial para você! Veja: ${link}`;
            
            if (btn.classList.contains('share-whatsapp')) {
                window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
            } else if (btn.classList.contains('share-instagram')) {
                alert('Copie o link e compartilhe no Instagram: ' + link);
            } else if (btn.classList.contains('share-tiktok')) {
                alert('Copie o link e compartilhe no TikTok: ' + link);
            }
        });
    });
    
    // Adicionar suporte a teclas de navegação
    document.addEventListener('keydown', (e) => {
        if (document.querySelector('#viewerTab.active')) {
            if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        }
    });
    
    // Para fins de demonstração/TikTok, vamos criar um botão para carregar uma demo
    function loadDemoTimeline() {
        // Verificar se já temos memórias
        if (memories.length <= 1 && !memories[0].imageUrl) {
            // Definir um nome para o destinatário
            document.getElementById('recipientName').value = 'Maria';
            // Definir uma mensagem final
            document.getElementById('finalMessage').value = 'Cada dia ao seu lado é uma nova aventura. Te amo mais que tudo!';
            
            // Limpar memórias existentes
            memories = [];
            
            // Adicionar novas memórias de demonstração (usaria imagens reais em um caso real)
            addDemoMemory(
                'Nosso primeiro encontro', 
                '12/01/2023',
                'Nunca vou esquecer o dia em que vi seu sorriso pela primeira vez naquele café.'
            );
            
            addDemoMemory(
                'Nosso primeiro Valentine', 
                '14/02/2023',
                'O jantar à luz de velas mais especial da minha vida. Você estava linda!'
            );
            
            addDemoMemory(
                'Nossa primeira viagem', 
                '20/04/2023',
                'Aqueles dias na praia foram mágicos. Cada pôr do sol com você é um presente.'
            );
            
            // Renderizar as memórias
            renderMemories();
            
            // Mostrar notificação de sucesso
            showToast('Demo carregada com sucesso! Clique em "Gerar Linha do Tempo"');
        }
    }
    
    // Função para adicionar memória de demonstração
    function addDemoMemory(title, date, description) {
        const id = memories.length + 1;
        // Gerar uma imagem de demonstração colorida
        const color = getRandomColor();
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        
        // Fundo colorido
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 400, 300);
        
        // Texto central
        ctx.fillStyle = 'white';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(title, 200, 150);
        
        // Converter para dataURL
        const imageUrl = canvas.toDataURL('image/jpeg');
        
        // Adicionar à lista de memórias
        memories.push({
            id,
            date,
            title,
            description,
            imageUrl
        });
    }
    
    // Gerar cor aleatória
    function getRandomColor() {
        const colors = [
            '#ff4b6a', // Rosa
            '#4a89dc', // Azul
            '#8cc152', // Verde
            '#f6bb42', // Amarelo
            '#967adc', // Roxo
            '#e9573f'  // Laranja
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // Mostrar notificação
    function showToast(message) {
        // Remover toast existente se houver
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            document.body.removeChild(existingToast);
        }
        
        // Criar novo toast
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Mostrar com delay para permitir animação
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        // Esconder após 3 segundos
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
    
    // Adicionar botão para carregar demo (para demonstração no TikTok)
    const demoBtn = document.createElement('button');
    demoBtn.id = 'loadDemoBtn';
    demoBtn.textContent = '🎬 Carregar Demo para TikTok';
    demoBtn.addEventListener('click', loadDemoTimeline);
    
    document.body.appendChild(demoBtn);
});