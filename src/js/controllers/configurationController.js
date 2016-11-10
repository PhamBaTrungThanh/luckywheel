const configurationController = (function() {

    let questionCount = Config.getQuestions().length;
    let wheelBoxCount = Config.getWheel().length;

    const colorPallet = Config.getColorPallet();
    const createSelectHTML = (list, item, type) => {
        let html = '';
        jQuery.each(list, function(index, node) {
            const selected = (item === node) ? `selected` : ``;
            html += `<option value="${node}" data-icon="./../assets/${type}/${node}" ${selected} class="circle">${node}</option>`;
        });
        return html;
    }
    const createColor = (index) => {
        if (index > colorPallet.length - 1) {
            index = index - Math.round(index / (colorPallet.length - 1)) * colorPallet.length - 1;
        }
        return {
            path: colorPallet[index].path,
            glow: colorPallet[index].glow,
        }
    }
    const deleteQuestion = (index) => {
        swal({
            title: 'Bạn chắc không?',
            text: "Lựa chọn xoá câu hỏi này?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonText: 'Không',
            confirmButtonText: 'Có',
            closeOnConfirm: true,
        }, function() {
            questionCount -= 1;
            console.log('remove question-%s', index);
            jQuery(`#question-${index}`).remove();
            Config.removeQuestion(index - 1);
            Materialize.toast('Đã xoá câu hỏi', 4000);
            configurationController.reloadQuestions();
        });      
    }
    const deleteWheelBox = (index) => {
        swal({
            title: 'Bạn chắc không?',
            text: "Lựa chọn xoá ô này?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonText: 'Không',
            confirmButtonText: 'Có',
            closeOnConfirm: true,
        }, function() {
            wheelBoxCount -= 1;
            console.log('remove wheel-box-%s', index);
            jQuery(`#wheel-box-${index}`).remove();
            Config.removeWheelBox(index - 1);
            Materialize.toast('Đã xoá ô', 4000);
            configurationController.reloadWheel();
        });   
    }
    const getWheelBox = () => {
        let list = [];
        jQuery('.wheelNode').each((index, node) => {
            const $elem = jQuery(node);
            list.push({
                type: $elem.find('input[role=type]:checked').val(),
                text: $elem.find('input[role=boxTitle]').val(),
                result: {
                    title: $elem.find('input[role=resultTitle]').val(),
                    text: $elem.find('input[role=resultDesc]').val(),
                },
                color: createColor(index),
            });
        });
        return list;
    }
    const getQuestions = () => {
        let list = [];
        jQuery('.question').each((index, question) => {
            const $question = jQuery(question);
            list.push({
                question: $question.find('input[role=question]').val(),
                answer: $question.find('input[role=answer]').val(),
                background: $question.find('select[role=background]').val(),
                image: $question.find('select[role=image]').val(),
            });
        });
        return list;
    }
    const createQuestionHTML = (index, question, answer, bgSelect, titleSelect) => {
        const string = `
            <div class="question row" id="question-${index}">
                <div class="col s10 push-s1">
                    <h5>Câu hỏi thứ ${index}</h5>
                    <div class="card">
                        <div class="card-stacked">
                            <div class="card-content">
                                <form>
                                    <div class="row">
                                        <div class="input-field col s12">
                                            <input type="text" role="question" value="${question}">
                                            <label for="question" class="active">Câu hỏi</label>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="input-field col s12">
                                            <input type="text" role="answer" value="${answer}">
                                            <label for="answer" class="active">Trả lời</label>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="input-field col s6">
                                            <select class="icons" role="background">
                                                <option value="" disabled>Copy hình bạn cần dùng vào thư mục asset/background</option>
                                                <option value="">Bỏ trống</option>
                                                ${bgSelect}
                                            </select>
                                            <label>Hình nền cho câu hỏi</label>
                                        </div>
                                        <div class="input-field col s6">
                                            <select class="icons" role="image">
                                                <option value="" disabled>Copy hình bạn cần dùng vào thư mục asset/image</option>
                                                <option value="">Bỏ trống</option>
                                                ${titleSelect}
                                            </select>
                                            <label>Hình chủ đề cho câu hỏi</label>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="card-action"><a class="btn-flat waves-effect red-text text-darken-2 delete-question" data-index="${index}">Xoá câu hỏi</a></div>
                        </div>
                    </div>
                </div>
            </div>`;
        return string;
    }
    const createWheelBoxHTML = (index, boxTitle, resultTitle, resultDesc, type) => {
        const isBingo = (type === 'bingo') ? 'checked' : '';
        const isPrize = (type === 'prize') ? 'checked' : '';
        const isSorry = (type === 'sorry') ? 'checked' : '';
        return `
            <div class="wheelNode row" id="wheel-box-${index}">
                <div class="col s11 push-s1">
                    <h5>Ô thứ ${index}</h5>
                    <div class="card">
                        <div class="card-stacked">
                            <div class="card-content">
                                <form>
                                    <div class="row">
                                        <div class="col s12">
                                            <span>Quay trúng ô này có thể:</span>
                                        </div>
                                        <div class="col s4">
                                            <input class="with-gap" role="type" type="radio" value="prize" ${isPrize} name="type" id="box-${index}-choice-1"/>
                                            <label for="box-${index}-choice-1">Được đoán</label>
                                        </div>
                                        <div class="col s4">
                                            <input class="with-gap" role="type" type="radio" value="bingo" ${isBingo} name="type" id="box-${index}-choice-2" />
                                            <label for="box-${index}-choice-2">Được thưởng</label>
                                        </div>
                                        <div class="col s4">
                                            <input class="with-gap" role="type" type="radio" value="sorry" ${isSorry} name="type" id="box-${index}-choice-3" />
                                            <label for="box-${index}-choice-3">Mất lượt</label>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="input-field col s12">
                                            <input type="text" role="boxTitle" value="${boxTitle}" length="15" class="text-counter">
                                            <label for="boxTitle" class="active">Tiêu đề ô</label>
                                        </div>	
                                        <div class="input-field col s12">
                                            <input type="text" role="resultTitle" value="${resultTitle}">
                                            <label for="resultTitle" class="active">Tiêu đề kết quả</label>
                                        </div>
                                        <div class="input-field col s12">
                                            <input type="text" role="resultDesc" value="${resultDesc}">
                                            <label for="resultDesc" class="active">Mô tả kết quả</label>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="card-action"><a class="btn-flat waves-effect red-text text-darken-2 delete-box" data-index="${index}">Xoá ô</a></div>
                        </div>
                    </div>
                </div>
            </div>`;
    }
    return {
        reloadQuestions: function() {
            const list = Config.getQuestions();
             const qBGList = Config.getBackgroundDir();
            const tBGList = Config.getImageDir();
            if (list.length > 0) {
                jQuery('.questions').first().html('');
                jQuery.each(list, function(index, node) {
                    const selector1 = createSelectHTML(qBGList, node.background, 'background');
                    const selector2 = createSelectHTML(tBGList, node.image, 'image');
                    jQuery('.questions').first().append(createQuestionHTML(index + 1 , node.question, node.answer, selector1, selector2));
                });
                $('select').material_select();
                $('.delete-question').on('click', function(event) {
                    const index = $(event.target).attr('data-index');
                    deleteQuestion(index);
                });
            }
        },
        addQuestion: function() {
            if (questionCount === 0) {
                jQuery('.questions').first().html('');
            }
            questionCount += 1;
            const qBGList = Config.getBackgroundDir();
            const tBGList = Config.getImageDir();
            const selector1 = createSelectHTML(qBGList, '', 'background');
            const selector2 = createSelectHTML(tBGList, '', 'image');
            jQuery('.questions').first().append(createQuestionHTML(questionCount, '', '', selector1, selector2));
            $('select').material_select();
            $('.delete-question').on('click', function(event) {
                const index = $(event.target).attr('data-index');
                deleteQuestion(index);
            });
        },
        reloadAll: () => {
            swal({
                type: 'warning',
                title: 'Bạn chắc chắn?',
                text: 'Việc tải lại sẽ xoá hết những gì bạn chưa lưu',
                showCancelButton: true,
                cancelButtonText: 'Không',
                confirmButtonText: 'Có',
                closeOnConfirm: true,
            }, function() {
                configurationController.reloadQuestions();
                Materialize.toast('Đã tải lại', 4000);
            });
        },
        viewWheel: () => {
            swal({
                title: 'Xem thử',
                imageUrl: renderWheel(getWheelBox()),
                imageWidth: 400,
                imageHeight: 400,
                width: 500,
                animation: false
            });
        },
        reloadWheel: () => {
            const list = Config.getWheel();
            jQuery('.wheelContainer').first().html('');
            jQuery.each(list, (index, node) => {
                jQuery('.wheelContainer').first().append(createWheelBoxHTML(index + 1, node.text, node.result.title, node.result.text, node.type));
            });
            $('.delete-box').on('click', function(event) {
                const index = $(event.target).attr('data-index');
                deleteWheelBox(index);
            });
        },
        addWheelBox: () => {
            wheelBoxCount += 1;
            jQuery('.wheelContainer').first().append(createWheelBoxHTML(wheelBoxCount, '', '', '', 'prize'));
            $('.delete-box').on('click', function(event) {
                const index = $(event.target).attr('data-index');
                deleteWheelBox(index);
            });
        },
        save: () => {
            const wheel = getWheelBox();
            const questions = getQuestions();
            const remote = require('electron').remote;
            const win = remote.getCurrentWindow();
            const path = require('path');
            const url = require('url');
            Config.saveQuestions(questions);
            Config.saveWheel(wheel);
            Config.saveWheelImage(renderWheel(wheel));
            Config.save();
            swal({
                title:'Thành công',
                text: 'Đã lưu lại dữ liệu',
                showCancelButton: true,
                cancelButtonText: 'Tiếp tục chỉnh sửa',
                confirmButtonText: 'Quay lại trò chơi',
                type: 'success',
            }, function(going) {
                if (going === true) {

                    win.loadURL(url.format({
                        pathname: path.join(__dirname, 'index.html'),
                        protocol: 'file:',
                        slashes: true
                    }));
                }
            });
        }
    }
})();