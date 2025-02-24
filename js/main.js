document.addEventListener('DOMContentLoaded', () => {
    // 自定义光标
    const cursor = {
        init() {
            this.cursor = document.querySelector('.dc-cursor');
            this.mainContent = document.querySelector('.dc__main');
            this.addEventListeners();
            // 默认隐藏系统光标
            document.body.style.cursor = 'none';
        },

        addEventListeners() {
            // 光标跟随
            document.addEventListener('mousemove', (e) => {
                requestAnimationFrame(() => {
                    this.cursor.style.left = e.clientX + 'px';
                    this.cursor.style.top = e.clientY + 'px';
                    this.updateCursorState(e);
                });
            });

            // 点击处理
            document.addEventListener('click', (e) => {
                if (this.shouldTriggerClose(e)) {
                    const expandedButton = document.querySelector('[data-button][aria-expanded="true"]');
                    if (expandedButton) {
                        expandedButton.click();
                    }
                }
            });
        },

        updateCursorState(e) {
            const target = document.elementFromPoint(e.clientX, e.clientY);
            
            // 在可交互元素或其子元素上显示系统光标并隐藏自定义光标
            if (target.matches('button, [data-button], a, [role="button"], .dc__nav button span')) {
                this.cursor.classList.add('hide');
                // 找到最近的可交互元素
                const interactiveElement = target.closest('button, [data-button], a, [role="button"]');
                if (interactiveElement) {
                    interactiveElement.style.cursor = 'pointer';
                }
                return;
            }
            
            // 其他区域显示自定义光标并隐藏系统光标
            this.cursor.classList.remove('hide');
            target.style.cursor = 'none';

            // 检查是否应该显示close
            if (this.shouldShowClose(e)) {
                this.cursor.classList.add('button-hover');
            } else {
                this.cursor.classList.remove('button-hover');
            }
        },

        shouldShowClose(e) {
            const hasExpandedContent = document.querySelector('.dc__main__container[aria-expanded="true"]');
            if (!hasExpandedContent) return false;

            // 确保不在导航区域
            const nav = document.querySelector('.dc__nav');
            const navRect = nav.getBoundingClientRect();
            const isOverNav = e.clientX >= navRect.left && 
                            e.clientX <= navRect.right && 
                            e.clientY >= navRect.top && 
                            e.clientY <= navRect.bottom;
            if (isOverNav) return false;

            // 确保不在内容区域
            const mainRect = this.mainContent.getBoundingClientRect();
            const isOverContent = e.clientX >= mainRect.left && 
                                e.clientX <= mainRect.right && 
                                e.clientY >= mainRect.top && 
                                e.clientY <= mainRect.bottom;
            
            return !isOverContent;
        },

        shouldTriggerClose(e) {
            return this.shouldShowClose(e) && this.cursor.classList.contains('button-hover');
        }
    };

    // 手风琴菜单
    const accordion = {
        init() {
            this.buttons = document.querySelectorAll('[data-button]');
            this.overlay = document.querySelector('.modal-overlay');
            this.addEventListeners();
            
            // 设置按钮动画延迟
            this.buttons.forEach((button, index) => {
                button.style.setProperty('--index', index);
            });

            // 添加遮罩层点击事件
            if (this.overlay) {
                this.overlay.addEventListener('click', () => {
                    const expandedButton = document.querySelector('[data-button][aria-expanded="true"]');
                    if (expandedButton) {
                        this.closePanel(expandedButton);
                        // 移除所有按钮的弱化效果
                        this.buttons.forEach(btn => btn.classList.remove('sibling-expanded'));
                    }
                });
            }
        },

        addEventListeners() {
            this.buttons.forEach(button => {
                button.addEventListener('click', () => {
                    const isExpanded = button.getAttribute('aria-expanded') === 'true';
                    
                    // 更新所有按钮状态
                    this.buttons.forEach(otherButton => {
                        if (otherButton !== button) {
                            if (otherButton.getAttribute('aria-expanded') === 'true') {
                                this.closePanel(otherButton);
                            }
                            // 当有面板展开时，为其他按钮添加弱化类
                            otherButton.classList.toggle('sibling-expanded', !isExpanded);
                        }
                    });

                    // 切换当前面板
                    if (isExpanded) {
                        this.closePanel(button);
                        // 移除所有按钮的弱化效果
                        this.buttons.forEach(btn => btn.classList.remove('sibling-expanded'));
                    } else {
                        this.openPanel(button);
                    }
                });
            });
        },

        openPanel(button) {
            const targetId = button.getAttribute('aria-controls');
            const target = document.getElementById(targetId);
            
            // 先关闭所有面板
            this.buttons.forEach(btn => {
                if (btn !== button) {
                    this.closePanel(btn);
                }
            });
            
            button.setAttribute('aria-expanded', 'true');
            target.style.display = 'block';
            
            requestAnimationFrame(() => {
                target.style.opacity = '1';
                target.style.transform = 'translateY(0)';
                target.setAttribute('aria-expanded', 'true');
            });
            
            this.setAnimationDelays(target);
        },

        closePanel(button) {
            const targetId = button.getAttribute('aria-controls');
            const target = document.getElementById(targetId);
            
            button.setAttribute('aria-expanded', 'false');
            target.style.opacity = '0';
            target.style.transform = 'translateY(20px)';
            target.setAttribute('aria-expanded', 'false');
            
            setTimeout(() => {
                target.style.display = 'none';
            }, 600);
        },

        setAnimationDelays(panel) {
            // 设置元素的动画延迟
            panel.querySelectorAll('.studio-content, .studio-list').forEach((el, index) => {
                el.style.setProperty('--index', index);
            });
            
            panel.querySelectorAll('.studio-list__content li').forEach((el, index) => {
                el.style.setProperty('--index', index);
            });
            
            panel.querySelectorAll('.studio-gallery img').forEach((el, index) => {
                el.style.setProperty('--index', index);
            });
            
            // 添加作品集项目的动画延迟
            panel.querySelectorAll('.work-item').forEach((el, index) => {
                el.style.setProperty('--index', index);
            });
        }
    };

    // 联系方式表单
    const contactForm = {
        init() {
            this.form = document.getElementById('contact-form');
            if (this.form) {
                this.addEventListeners();
            }
        },

        addEventListeners() {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                // 这里添加表单提交逻辑
                console.log('Form submitted');
                this.form.reset();
            });
        }
    };

    // 添加滚动文字动画
    const scroller = {
        init() {
            this.scrollers = document.querySelectorAll('.home-scroller__line');
            this.baseSpeed = 0.2;    // 稍微降低基础速度
            this.maxSpeed = 0.5;     // 降低最大速度
            this.acceleration = 0.2;  // 相应调整加速度
            this.direction = -1;
            this.isScrolling = true;
            this.velocity = this.baseSpeed * this.direction;
            this.lastWheelTime = 0;
            
            // 阻止页面滚动
            document.body.style.overflow = 'hidden';
            document.addEventListener('wheel', (e) => {
                // 只在没有展开内容时阻止滚动
                if (!document.querySelector('.dc__main__container[aria-expanded="true"]')) {
                    e.preventDefault();
                }
            }, { passive: false });
            
            // 添加触摸事件支持
            this.touchStartY = 0;
            this.touchStartTime = 0;
            this.isTouching = false;
            
            document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
            document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
            document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });

            if (this.scrollers.length) {
                this.setupScroll();
                this.handleContentState();
                this.handleWheelDirection();
            }
        },

        setupScroll() {
            this.scrollers.forEach(scroller => {
                const content = scroller.querySelector('.home-scroller__content');
                const items = Array.from(content.children);
                const itemHeight = items[0].offsetHeight;
                
                // 复制五份内容确保上下都有足够内容
                for (let i = 0; i < 4; i++) {
                    items.forEach(item => {
                        content.appendChild(item.cloneNode(true));
                    });
                }

                let currentScroll = -itemHeight * items.length;
                const totalHeight = content.scrollHeight / 5;

                const animate = () => {
                    if (!this.isScrolling) {
                        requestAnimationFrame(animate);
                        return;
                    }

                    currentScroll += this.velocity;

                    // 无缝循环
                    if (currentScroll >= 0) {
                        currentScroll = -totalHeight;
                    } else if (currentScroll <= -totalHeight * 2) {
                        currentScroll = -totalHeight;
                    }

                    content.style.transform = `translate3d(0, ${currentScroll}px, 0)`;
                    requestAnimationFrame(animate);
                };

                animate();
            });
        },

        handleWheelDirection() {
            document.addEventListener('wheel', (e) => {
                if (document.querySelector('.dc__main__container[aria-expanded="true"]')) {
                    return; // 如果有展开内容，不处理滚动
                }

                // 反转滚动方向（自然滚动）
                const newDirection = e.deltaY > 0 ? -1 : 1;
                
                // 如果方向改变，重置速度
                if (newDirection !== this.direction) {
                    this.velocity = this.baseSpeed * newDirection;
                }
                
                this.direction = newDirection;
                
                // 增加速度，但不超过最大值
                this.velocity = Math.min(Math.max(Math.abs(this.velocity) + this.acceleration, this.baseSpeed), this.maxSpeed) * this.direction;
            });
        },

        handleContentState() {
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.target.hasAttribute('aria-expanded')) {
                        const hasExpandedContent = document.querySelector('.dc__main__container[aria-expanded="true"]');
                        document.body.classList.toggle('has-expanded-content', hasExpandedContent);
                        
                        if (hasExpandedContent) {
                            // 保存当前状态
                            this.savedVelocity = this.velocity;
                            this.isScrolling = false;
                            // 允许页面滚动，但只在展开的内容区域
                            document.body.style.overflow = '';  // 移除 'hidden'，允许滚动
                            document.documentElement.style.overflow = '';  // 确保 html 元素也可以滚动
                        } else {
                            // 恢复速度但保持当前方向
                            this.velocity = Math.abs(this.savedVelocity || this.baseSpeed) * this.direction;
                            this.isScrolling = true;
                            // 重新禁用页面滚动
                            document.body.style.overflow = 'hidden';
                            document.documentElement.style.overflow = 'hidden';
                        }
                    }
                });
            });

            observer.observe(document.querySelector('.dc__main'), {
                attributes: true,
                subtree: true,
                attributeFilter: ['aria-expanded']
            });
        },

        handleTouchStart(e) {
            if (document.querySelector('.dc__main__container[aria-expanded="true"]')) {
                return; // 如果有展开内容，不处理触摸
            }
            this.touchStartY = e.touches[0].clientY;
            this.touchStartTime = Date.now();
            this.isTouching = true;
            this.lastTouchY = this.touchStartY;
            e.preventDefault();
        },

        handleTouchMove(e) {
            if (!this.isTouching || document.querySelector('.dc__main__container[aria-expanded="true"]')) {
                return;
            }

            const currentY = e.touches[0].clientY;
            const deltaY = currentY - this.lastTouchY;
            this.lastTouchY = currentY;

            // 根据滑动方向和速度调整滚动
            const newDirection = deltaY > 0 ? 1 : -1;
            
            // 如果方向改变，重置速度
            if (newDirection !== this.direction) {
                this.velocity = this.baseSpeed * newDirection;
            }
            
            this.direction = newDirection;
            
            // 根据滑动速度调整滚动速度
            const speed = Math.abs(deltaY) * 0.1; // 调整系数以获得合适的响应
            this.velocity = Math.min(Math.max(Math.abs(this.velocity) + speed, this.baseSpeed), this.maxSpeed) * this.direction;

            e.preventDefault();
        },

        handleTouchEnd(e) {
            if (!this.isTouching) return;
            
            this.isTouching = false;
            const touchEndY = e.changedTouches[0].clientY;
            const deltaY = touchEndY - this.touchStartY;
            const deltaTime = Date.now() - this.touchStartTime;
            
            // 计算滑动速度
            const velocity = Math.abs(deltaY / deltaTime);
            
            // 根据滑动速度设置惯性
            if (velocity > 0.5) { // 调整阈值以获得合适的响应
                this.velocity = Math.min(velocity * 2, this.maxSpeed) * (deltaY > 0 ? 1 : -1);
            }

            e.preventDefault();
        }
    };

    // 初始化
    cursor.init();
    accordion.init();
    contactForm.init();
    scroller.init();

    document.querySelectorAll('.accordion-button').forEach(button => {
        button.addEventListener('click', () => {
            const accordionItem = button.parentElement;
            const isActive = accordionItem.classList.contains('active');
            
            // 关闭所有其他项
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // 如果当前项未激活，则激活它
            if (!isActive) {
                accordionItem.classList.add('active');
            }
        });
    });
}); 