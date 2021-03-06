/*
 1. render songs -->ok
2. scroll top -->ok
3. play/pause/seek -->ok
4. CD rotate -->error 10s end rotate -> use oniput thay cho onchảnge
5. Next/prev -->ok
6. Random -->ok
7.Next/repeat when ended -->ok
8. Active song -->ok
9. Scroll active song into view -->ok
10. Play song when click
 */
const PLAYER_STORAGE_KEY = 'app_music';
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const btnRandom = $('.btn-random');
const btnRepeat = $('.btn-repeat');
const playList = $('.playlist');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

    songs: [{
        name: 'song1',
        singer: 'singer1',
        path: './assets/music/no2.mp3',
        image: './assets/img/img1.jpg'
    }, {
        name: 'song2',
        singer: 'singer2',
        path: './assets/music/no2.mp3',
        image: './assets/img/img2.jpg'
    }, {
        name: 'song3',
        singer: 'singer3',
        path: './assets/music/no3.m4a',
        image: './assets/img/img3.jpg'
    }, {
        name: 'song4',
        singer: 'singer4',
        path: './assets/music/no1.mp3',
        image: './assets/img/img1.jpg'
    }, {
        name: 'song5',
        singer: 'singer5',
        path: './assets/music/no2.mp3',
        image: './assets/img/img2.jpg'
    }, {
        name: 'song6',
        singer: 'singer6',
        path: './assets/music/no3.m4a',
        image: './assets/img/img3.jpg'
    }, {
        name: 'song7',
        singer: 'singer7',
        path: './assets/music/no1.mp3',
        image: './assets/img/img1.jpg'
    }, {
        name: 'song8',
        singer: 'singer8',
        path: './assets/music/no2.mp3',
        image: './assets/img/img2.jpg'
    }, {
        name: 'song9',
        singer: 'singer9',
        path: './assets/music/no3.m4a',
        image: './assets/img/img3.jpg'
    }, ],

    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    // hàm render để render code xử lí đẩy lên UI
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `<div class="song ${index === this.currentIndex ? 'active':''}" data-index="${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>`
        })
        playList.innerHTML = htmls.join('\n');
    },
    //hàm định nghĩa các thuộc tính cho Object
    defineProperties: function() {

        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];

            },
        })
    },

    // hàm handle để xử lí các sự kiện
    handleEvents: function() {
        _this = this;
        const cdWidth = cd.offsetWidth;

        //xử lí quay đĩa CD
        // const songDurationTime = this.audio.duration;
        const cdThumbAnimate = cdThumb.animate([{
            transform: 'rotate(360deg)'
        }], {
            duration: 10000,
            iteration: Infinity,
        })
        cdThumbAnimate.pause();


        //xử lí phóng to thu nhỏ CD khi trượt lên xuống
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;

            //chiều ngang mới sẽ bằng chiều ngang cd cũ trừ đi px tính được
            //lúc lăn chuột để giảm width cũ đi thì cd sẽ nhỏ lại
            const newCdWidth = cdWidth - scrollTop;

            //trường hợp lăn nhanh sẽ trừ ra số âm thì ta gán 
            //width = 0 lun để ẩn hoàn toàn cd
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            //làm mờ cd khi cuộn
            cd.style.opacity = newCdWidth / cdWidth;
        }

        //hàm xử lí play/pause music khi click icon
        playBtn.onclick = function() {
                if (_this.isPlaying) {
                    audio.pause();
                } else {
                    audio.play();
                }
            }
            //bắt sự kiện play music
        audio.onplay = function() {
                _this.isPlaying = true;
                player.classList.add('playing');
                cdThumbAnimate.play();
            }
            //bắt sự kiện khi pause music
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        //xem sự thay đổi tiến độ bài hát
        audio.ontimeupdate = function() {
                if (audio.duration) {
                    //tính phần trăm bài hát
                    progressPercentage = Math.floor(audio.currentTime / audio.duration * 100);
                    progress.value = progressPercentage;
                    // console.log(progressPercentage);//xem phần trăm bài hát

                }
            }
            // thực hiện việc thay đổi tiến độ bài hát
        progress.oninput = function(e) {
                prencentNow = e.target.value; //phần trăm hiện tại
                const seekTime = Math.floor(prencentNow * audio.duration / 100);
                audio.currentTime = seekTime;
                // console.log(seekTime);//xem time hiện tại khi tua
            }
            // bắt xự kiện next bài hát
        nextBtn.onclick = function() {
                if (_this.isRandom) {
                    _this.playRandomSong();
                } else {
                    _this.nextSong();

                }
                audio.play();
                _this.render();
                _this.scrollToActiveSong();

            }
            //bắt sự kiện prev bài hát
        prevBtn.onclick = function() {
                if (_this.isRandom) {
                    _this.playRandomSong();
                } else {
                    _this.prevSong();

                }
                audio.play();
                _this.render();
                _this.scrollToActiveSong();
            }
            //bắt sự kiện bật tắt random bài hát
        btnRandom.onclick = function() {
                _this.isRandom = !_this.isRandom;
                _this.setConfig('isRandom', _this.isRandom); //lưu trạng thái cấu hình nút random khi F5
                btnRandom.classList.toggle('active', _this.isRandom)
            }
            //bắt sự kiện bật tắt phát lại bài hát
        btnRepeat.onclick = function() {
                _this.isRepeat = !_this.isRepeat;
                _this.setConfig('isRepeat', _this.isRepeat); //lưu trạng thái cấu hình nút repeat khi F5
                btnRepeat.classList.toggle('active', _this.isRepeat)
            }
            //xử lí khi kết thúc bài hát
        audio.onended = function() {
                if (_this.isRepeat) {
                    audio.play();
                } else {
                    nextBtn.click();
                }
            }
            // xử lí khi chọn bài hát trong danh sách để phát
        playList.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            const songOption = e.target.closest('.option');
            // console.log(e.target)
            if (songNode || songOption) {
                //thay đổi khi nhấn vào bài bất kì
                if (songNode) {
                    _this.currentIndex = Number(songNode.getAttribute('data-index'));
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
                //tùy chọn option muốn làm gì làm
                if (songOption) {

                }
            }
        }
    },
    // hàm xử lí vị trí bài hát khi chuyển
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
        }, 250)
    },
    // hàm tải các bài hát hiện tại
    loadCurrentSong: function() {

        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    // gán cấu hình từ config vào máy
    loadConfig: function() {
        this.isRepeat = this.config.isRepeat;
        this.isRandom = this.config.isRandom;

    },
    // hàm xử lí next bài hát 
    nextSong: function() {
        this.currentIndex++;
        console.log(this.currentIndex, this.songs.length) //xem vị trí bài hát hiện tại so với danh sách
        if (this.currentIndex > this.songs.length - 1) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    // hàm xử lí prev bài hát 
    prevSong: function() {
        Math.abs(this.currentIndex--);
        // console.log(this.currentIndex, this.songs.length)
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    //hàm xử lí random bài hát
    playRandomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
        // console.log(newIndex, this.songs.length)
    },
    // hàm start để thực thi code khi render xong
    start: function() {
        this.loadConfig();

        this.defineProperties();

        this.scrollToActiveSong();

        this.handleEvents();

        this.loadCurrentSong();

        this.render();

        btnRandom.classList.toggle('active', _this.isRandom)
        btnRepeat.classList.toggle('active', _this.isRepeat)
    }
}

app.start();