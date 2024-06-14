(function(){
  
  var chat = {
    messageToSend: '',
    currentNode: 0,
    userName: null,
    waiting: 0,
    calendarInput: false,
    state: '',
    state_code: '',
    category: '',
    msg_timeout: null,
    wait_timeout: null,
    awaiting_feedback: false,
    singleChoice: false,
    tipShown: false,
    //endResponse: false,

    init: function() {
      this.cacheDOM();
      this.sendWelcomeMessage(),
      this.bindEvents();
    },
    cacheDOM: function() {
      this.$menu = $('ul.menu');
      this.$menuItem = $('li.menu-item');
      this.$chatHistory = $('.chat-history');
      this.$button = $('.chat-message .send-button');
      this.$textarea = $('#message-to-send');
      this.$chatHistoryList =  this.$chatHistory.find('ul');
      this.$startOverButton = $('#start_over');
      //this.$infoList = $('ul.list');
      this.$profileInfo = $('.profile-info');
      this.$contactHumanButton = $('#contact_human');
      this.$menuButton = $('#menu_button');
      this.$isMobile = device.mobile() || device.tablet();
    },
    bindEvents: function() {
      this.$button.on('click', this.addMessage.bind(this,''));
      this.$textarea.on('keyup', this.addMessageEnter.bind(this));
      this.$chatHistoryList.on('click touchstart','.choice',function(e){
        e.stopPropagation();
        e.preventDefault();
        this.makeChoice(e.target);
        e.target.removeAttribute('tabindex');
      }.bind(this));
      this.$chatHistoryList.on('click touchstart','.choice-photo',function(e){
        e.stopPropagation();
        e.preventDefault();
        this.makePhotoChoice(e.target);
      }.bind(this));
      this.$chatHistoryList.on('mouseenter','.choice-photo',function(e){
        $(this).css('background-image','url('+ $(this).data('img-hover')+')');
        $('<img/>')[0].src = $(this).data('img');
      }).on('mouseleave click','.choice-photo',function(e){
        $(this).css('background-image','url('+ $(this).data('img')+')');
        $('<img/>')[0].src = $(this).data('img-hover');
      });
      this.$chatHistoryList.on('keyup','.choice',function(e){
        var key = e.which;
        if (key === 13) {
          this.makeChoice(e.target);
          e.target.removeAttribute('tabindex');
        }
      }.bind(this));
      this.$menuButton.click(function(e){
        var el = e.target;
        if($(el).hasClass('menu-open')){
          this.closeMenu();
        }else{
          $(el).addClass('menu-open');
          var rect = $('.chat-header')[0].getBoundingClientRect();
          var header_height = rect.height;
          $('.chat-header-filler .menu-content').css('margin-top',header_height+'px');
          var menu_content_height = $('.chat-header-filler .menu-content').outerHeight();
          var menu_height = header_height+menu_content_height;
          $('.chat-header-filler').animate({height: menu_height+'px'}, 200);
          this.$chatHistory.one('click',function(){
            if($(el).hasClass('menu-open')) this.closeMenu();
          }.bind(this));
        }
      }.bind(this));
      this.$menuItem.on('click',function(){
        this.closeMenu();
      }.bind(this));
      this.$menu.on('click','.start-over',function(e){
        this.startOver();
      }.bind(this));
      this.$menu.on('click','.contact-human', function(){
        this.sendFeedback();
      }.bind(this));

      this.$chatHistory.on('click','.start-over',function(e){
        this.closeMenu();
        $(e.target).removeClass('start-over').addClass('choice-made');
        this.startOver();
      }.bind(this));
      this.$startOverButton.on('click', function(){
        this.startOver();
      }.bind(this));
      this.$contactHumanButton.on('click', function(){
        this.sendFeedback();
      }.bind(this));
      this.$chatHistory.on('click','.contact-human', function(){
        this.closeMenu();
        this.sendFeedback();
      }.bind(this));
      this.$chatHistory.on('click','.find-dmv', function(){
        if(this.state_code){
          var state_name = states[this.state_code].state;
          var dmv_url = 'https://driving-tests.org/'+state_name.toLowerCase()+'/'+this.state_code.toLowerCase()+'-dmv-office-locations/';
        }
        if(dmv_url) window.open(dmv_url,'_blank');
        else window.open('https://driving-tests.org/dmv-near-me/','_blank');
      }.bind(this));
      this.$chatHistory.on('click','.visit-website', function(){
        if(this.state_code) var dmv_url = states[this.state_code].link;
        if(dmv_url) window.open(dmv_url,'_blank');
        else window.open('https://driving-tests.org/','_blank');
      }.bind(this));
      /*this.$chatHistory.on('mouseenter','.chat-block.user-msg', function(){
        $(this).find('.change-answer').css('visibility','visible');
      }).on('mouseleave','.clearfix.chat-block', function(){
        $(this).find('.change-answer').css('visibility','hidden');
      });*/
      this.$chatHistory.on('click','.change-answer', function(e){
        //this.endResponse = false;
        if(this.msg_timeout){
          clearTimeout(this.msg_timeout);
          this.msg_timeout = null;
        }
        if(this.wait_timeout){
          clearTimeout(this.wait_timeout);
          this.wait_timeout = null;
        }
        /*if(this.waiting){
          $('.waiting').remove();
          this.waiting=0;
        }*/
        $('li.chat-block:last-of-type >.my-message >.waiting').closest('.chat-block').remove();
        this.waiting=0;

        if(this.awaiting_feedback){
          this.awaiting_feedback = false;
        }
	      this.singleChoice = false;
        var el = e.target;
        var chat_block = $(el).closest('.chat-block');
        var current_block = chat_block.prev();
        chat_block.nextAll().add(chat_block).remove();
        current_block.effect("bounce", { times:3, distance:15 }, 400);
        var current_id = current_block.attr('id');
        var arr = current_id.split('-');
        current_id = arr[1];
        this.currentNode = current_id;
        current_block.find('.choice-made').removeClass('choice-made').addClass('choice');
        current_block.find('.photo-chosen').removeClass('photo-chosen').addClass('choice-photo');
        current_block.find('.choice-photo').map(function() {
           $('<img/>')[0].src = $(this).data('img-hover');
        });
        //this.$textarea.unmask().datepicker('destroy').attr('placeholder','Type your message').prop('disabled', false).focus();
        this.$textarea.unmask().val('').attr('placeholder','Type your message');
        this.calendarInput = false;
        if(current_block.data("calendar")){
          this.calendarInput = true;
          if(device.ios()){
            this.$textarea.attr('type','date').val('1990-01-01');
          } else {
            this.$textarea.attr('placeholder','MM/DD/YYYY');
            this.$textarea.mask("99/99/9999",{placeholder:"MM/DD/YYYY"});
          }
          /*this.$textarea.datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'mm/dd/yy',
            yearRange: "-100:+5"
          });
          if(this.$textarea.is(":focus")){
            this.$textarea.on('click.showDatePicker', function(){
              this.$textarea.datepicker('show');
            }.bind(this));
          }*/
        }
        var choices = $('.chat-history ul:last-child .choices').find('.choice,.button,.choice-photo');
        if($(choices).length>1){
          this.$textarea.prop('disabled', true).attr('placeholder','Select one of the options above');
        }else if($(choices).length==1){
          if(this.$isMobile){
            this.$textarea.prop('disabled', true).attr('placeholder','Press OK to continue');
          }else{
            this.$textarea.prop('disabled', true).attr('placeholder','Press Enter to continue');
            $(choices).first().attr('tabindex','1').focus();
          }
        }else if(this.calendarInput){
            this.$textarea.prop('disabled', false).focus().trigger('click');
        }else this.$textarea.prop('disabled', false).focus();
        $.ajax({
          type:'GET',
          url:'test.quizzie.php?clear_exempt',
          cache:true, // false
          dataType:'json',
          context: this,
          timeout:71000
        });
      }.bind(this));
      this.$chatHistory.on('mouseenter','.chat-block.bot-msg', function(){
        //$(this).find('.send-feedback').css('visibility','visible');
      }).on('mouseleave','.chat-block.bot-msg', function(){
        $(this).find('.send-feedback').css('visibility','hidden');
      });
      this.$chatHistory.on('click','.send-feedback', function(e){
        var el = e.target;
        var chat_block = $(el).parent().parent();
        this.sendFeedback(chat_block);
      }.bind(this));
      this.$chatHistory.on('click','.spoiler-title', function(e){
        var el = e.target;
        //var spoiler = $(el).parent();
        var spoiler = $(el).closest('.spoiler');
        var spoiler_content = spoiler.find('> .spoiler-content');
        if(spoiler.hasClass('expanded')){
          spoiler_content.slideUp(200);
          spoiler.removeClass('expanded');
        }else{
          spoiler_content.slideDown(200);
          spoiler.addClass('expanded');
          setTimeout(function(){
            var spoiler_top = spoiler.offset().top;
            var spoiler_bottom = spoiler_top + spoiler.outerHeight();
            var viewport_top = this.$chatHistory.offset().top;
            var viewport_bottom = viewport_top + this.$chatHistory.outerHeight();
            var scroll_top = this.$chatHistory.scrollTop()+(spoiler_top-viewport_top)-20;
            var scroll_bottom = spoiler_bottom - viewport_bottom + this.$chatHistory.scrollTop()+20; 
            if(spoiler_bottom>(viewport_bottom-20)){
              if(this.$chatHistory.outerHeight()>(spoiler.outerHeight()+20)){
                  this.$chatHistory.scrollTop(scroll_bottom);
                }else{
                  this.$chatHistory.scrollTop(scroll_top);
                }
            }
          }.bind(this),200);
        }
      }.bind(this));
    },
    renderMessage: function() {
      this.scrollToBottom();
      var template = Handlebars.compile( $("#message-template").html());
      var first_letter = '';
      if(this.userName) first_letter = this.userName.charAt(0);
      var msg_id = 'msg-'+this.currentNode;
      if(this.messageToSend.toLowerCase()=='y') this.messageToSend='Yes';
      if(this.messageToSend.toLowerCase()=='n') this.messageToSend='No';
      if(this.awaiting_feedback) this.singleChoice = true;
      var context = { 
        messageOutput: this.messageToSend,
        time: this.getCurrentTime(),
        user: this.userName,
        letter: first_letter,
        message_id: msg_id,
        singleChoice: this.singleChoice
      };
      this.$chatHistoryList.append(template(context));
      this.scrollToBottom();
      this.$textarea.val('');
      var userInput = document.getElementById('message-to-send');
      userInput.value = '';
    },
    sendWelcomeMessage: function(){
      this.$textarea.prop('disabled', true);
      $.ajax({
        type:'GET',
        url:'test.quizzie.php',
        data:'welcome=true',
        cache:true, // false
        dataType:'json',
        context: this,
        timeout:71000
      }).done(function(data){
        this.currentNode = data.node_id;
        if(Array.isArray(data.response)){
          for(i=0; i<data.response.length; i++){
            if(data.response.length==(i+1)){
              var to_follow = false;
            } else var to_follow = true;
            var message = data.response[i];
            if(i==0) delay=1000;
            else delay = (i+1)*2000;
            this.renderResponse(message,delay,null,false,to_follow);
          }
        }else this.renderResponse(data.response);
      }).fail(function(){
        this.renderResponse('Sorry, i\'m currently busy. Please come back later.');
      });  
    },
    renderResponse: function(input,delay,rsp_id,cal_flag,to_follow_flag, end_node_flag){
      this.singleChoice = false;
      if(!delay) delay=1500;
      var templateResponse = Handlebars.compile( $("#message-response-template").html());
      if(!rsp_id) rsp_id = 'rsp-'+this.currentNode;
      if(!cal_flag) cal_flag = false;
      var contextResponse = { 
        response: input,
        time: this.getCurrentTime(),
        message_id: rsp_id,
        cal_flag: cal_flag
      };
      if (!this.waiting){
        this.$chatHistoryList.append(templateResponse(contextResponse));
        $('li.chat-block:last-of-type >.my-message').append('<div class="waiting"><span>.</span><span>.</span><span>.</span></div>');
        this.waiting=delay+1000;
        //this.scrollToBottom();
        this.scrollToBottom2();
      }else{
        this.wait_timeout = setTimeout(function() {
          this.$chatHistoryList.append(templateResponse(contextResponse));
          $('li.chat-block:last-of-type >.my-message').append('<div class="waiting"><span>.</span><span>.</span><span>.</span></div>');
          //this.scrollToBottom();
          this.scrollToBottom2();
        }.bind(this), this.waiting);
        this.waiting=delay+1000;
      }
      /*if (!this.waiting){
        this.$chatHistoryList.append('<div class="waiting"><span>.</span><span>.</span><span>.</span></div>');
        this.waiting=delay;
        this.scrollToBottom();
      }else{
        setTimeout(function() {
          this.$chatHistoryList.append('<div class="waiting"><span>.</span><span>.</span><span>.</span></div>');
          this.scrollToBottom();
        }.bind(this), this.waiting);
        this.waiting=delay;
      }*/

      this.msg_timeout = setTimeout(function() {
        //$('.waiting').remove();
        this.scrollToBottom();
        var self=this;
        $('li.chat-block:last-of-type >.my-message >.waiting').empty().animate({'width':'100%','height':'100%'},/*300*/0,function(){
          $(this).addClass('noshadow');
          $(this).parent().css({'visibility':'visible'});
          $(this).fadeOut(200,function(){
            $(this).remove();
            if(end_node_flag){
              self.awaiting_feedback = true;
              self.addLikes(document, 'script', 'facebook-jssdk');
            }
            if(cal_flag){
              if(device.ios()){
                self.$textarea.attr('type','date').val('1990-01-01');
              }else{
                self.$textarea.mask("99/99/9999",{placeholder:"MM/DD/YYYY"});             
                self.$textarea.attr('placeholder','MM/DD/YYYY');
              }
            }
            $('.message a').attr('target', '_blank');
            var choices = $('.chat-history ul:last-child .choices').find('.choice,.button,.choice-photo');
            if($(choices).length>1){
              self.$textarea.prop('disabled', true).attr('placeholder','Select one of the options above');
            }else if($(choices).length==1){
              if(self.$isMobile){
                self.$textarea.prop('disabled', true).attr('placeholder','Press OK to continue');
              }else{
                self.$textarea.prop('disabled', true).attr('placeholder','Press Enter to continue');
                $(choices).first().attr('tabindex','1').focus();
              }
              self.singleChoice=true;
            }else if(cal_flag){
              self.$textarea.prop('disabled', false).focus();
            }else if(!to_follow_flag){
              self.$textarea.prop('disabled', false).focus();
            }
            $('.chat-history ul:last-child .choices').find('.choice-photo').map(function() {
               $('<img/>')[0].src = $(this).data('img-hover');
            });
          });
        });
        this.waiting=0;
        //this.$chatHistoryList.append(templateResponse(contextResponse));
        
        var win_height = $(window).height();
        $(window).one('resize.keyboardup',function(){
          if(win_height!=$(window).height()){
            //this.scrollToBottom();
            var scrollTo=$('li.chat-block:last-of-type');
            var bottom = scrollTo.offset().top + scrollTo.outerHeight() + 20;
            var bottom2 = this.$chatHistory.offset().top + this.$chatHistory.outerHeight();
            this.$chatHistory.scrollTop(
                bottom - bottom2 + this.$chatHistory.scrollTop()
            );
          }
        }.bind(this));
      }.bind(this), delay);
      
    },
    addMessage: function(message) {
      $(window).off('resize.keyboardup');
      this.closeMenu();
      if(!message){
        this.messageToSend = this.$textarea.val();
        if (this.messageToSend.trim() == '') return;
      }else this.messageToSend = message;

      if(this.calendarInput){
        if(this.messageToSend = this.isValidDate(this.messageToSend)){
          //this.$textarea.datepicker('destroy').attr('placeholder','Type your message').off('click.showDatePicker');
          this.$textarea.attr({'placeholder':'Type your message','type':'text'}).val('').unmask();
          this.calendarInput = false;
        }else{
          var resp = 'Please enter the correct date in MM/DD/YYYY format (for example, 02/23/1984)';
          var msg_id = 'servicemsg-'+this.currentNode;
          this.renderResponse(resp,1500,msg_id,true);
          return;
        }
      }
      
      this.renderMessage();
      this.$textarea.prop('disabled', true);
      /*if(this.msg_timeout){
        clearTimeout(this.msg_timeout);
        this.msg_timeout = null;
      }*/
      /*if(this.endResponse) return;*/
      if(this.awaiting_feedback){
        $.ajax({
          type:'GET',
          url:'test.quizzie.php',
          data:{'feedback_sent': true, 'message': this.messageToSend, 'current_node': this.currentNode},
          cache:true, // false
          dataType:'json',
          context: this,
          timeout:71000
        }).done(function(res){
          console.log(res);
          this.awaiting_feedback=false;
          var feedback_received = 'Many thanks for your feedback, <strong>'+this.userName+'</strong>! I\'ll forward it to the team.<div class="choices"><div class="button start-over">Start Over</div><div class="button find-dmv">Find DMV office near you</div><div class="button visit-website">Visit DMV website</div><div class="button contact-human">Contact human</div></div>';
          this.renderResponse(feedback_received,2000,'feedback-received',false);
          //this.endResponse = true;
        });
        return;
      }
      $.ajax({
        type:'GET',
        url:'test.quizzie.php',
        data:{'message': this.messageToSend, 'node_id': this.currentNode},
        cache:true, // false
        dataType:'json',
        context: this,
        timeout:71000
      }).done(function(data){
        //console.log(data);
        if(data.error){
          data.response = data.error;
        }
        if(data.calendar_flag){
          this.calendarInput = true;
        }else{
          this.calendarInput = false;
        }
        var cal_flag = false;
        if(data.node_id) this.currentNode = data.node_id;
        if(!data.error){
          var rsp_id = 'rsp-'+this.currentNode;
        }else{
          var rsp_id = 'servicemsg-'+this.currentNode;
        }
        var end_node = false;
        if(Array.isArray(data.response)){
          /*var cal_index = data.response.indexOf('calendar_flag');
          if(cal_index>-1){
            this.calendarInput = true;
            data.response.splice(cal_index, 1);
          }*/
          this.msg_timeout = setTimeout(function(){
            for(i=0; i<data.response.length; i++){
              var message = data.response[i];
              if(i==0) delay=1000;
              else delay = (i+1)*2000;
              if(data.response.length==(i+1)){
                if(data.logical){
                  if(this.$isMobile){
                    message +='<div class="choices logical-choices"><span class="choice logical-choice">Yes</span><span class="choice logical-choice">No</span></div>';
                  }else if(!this.$tipShown){
                    message += '<div class="comment">You can answer <strong>Y</strong> for Yes or <strong>N</strong> for No.</div>';
                    this.$tipShown=true;
                  }
                }
                if(this.calendarInput) cal_flag = true;
                if(data.request_feedback){
                  message += '<br>'+data.request_feedback;
                  end_node = true;
                }
                var to_follow = false;
              } else to_follow = true;
              this.renderResponse(message,delay,rsp_id,cal_flag,to_follow,end_node);
            }
          }.bind(this), 1000);
        }else{
          this.msg_timeout = setTimeout(function(){
            delay = 1000;
            if(data.logical){
              if(this.$isMobile){
                data.response +='<div class="choices logical-choices"><span class="choice logical-choice">Yes</span><span class="choice logical-choice">No</span></div>';
              }else if(!this.$tipShown){
                data.response += '<div class="comment">You can answer <strong><i>Y</i></strong> for Yes or <strong><i>N</i></strong> for No.</div>';
                this.$tipShown=true;
              }
            }
            if(data.request_feedback){
              data.response += '<br>'+data.request_feedback;
              end_node = true;
            }
            this.renderResponse(data.response, delay, rsp_id, this.calendarInput, false, end_node);
            /*if(this.calendarInput){
              setTimeout(function(){
                this.$textarea.mask("99/99/9999",{placeholder:"MM/DD/YYYY"});             
                this.$textarea.attr('placeholder','MM/DD/YYYY');*/
                /*this.$textarea.datepicker({
                  changeMonth: true,
                  changeYear: true,
                  dateFormat: 'mm/dd/yy',
                  yearRange: "-100:+5"
                });
                if(this.$textarea.is(":focus")){
                  this.$textarea.on('click.showDatePicker', function(){
                    this.$textarea.datepicker('show');
                  }.bind(this));
                }*/
              /*}.bind(this), delay);
            }*/
          }.bind(this), 1000);
        }
        /*if(data.request_feedback){
          if(!data.request_delay) data.request_delay = 2000;
          this.msg_timeout = setTimeout(function(){
            this.renderResponse(data.request_feedback,2000,'feedback-request',false);
            this.awaiting_feedback = true;
          }.bind(this), data.request_delay);
        }*/
        $.ajax({
          type:'GET',
          url:'test.quizzie.php',
          data:'session_info=true',
          cache:true, // false
          dataType:'json',
          context: this,
          timeout:71000
        }).done(function(session_vars){
          if(session_vars.name){
            if(!this.userName){
              if (typeof FS != "undefined") {
                FS.setUserVars({"displayName" : session_vars.name});
              }
            }
            this.userName = session_vars.name;
          }
          if(session_vars.age) this.age = session_vars.age;
          if(session_vars.state) this.state = session_vars.state;
          if(session_vars.state) this.state_code = session_vars.state_code;
          if(session_vars.category) this.category = session_vars.category;
          if(session_vars){
            /*Object.keys(session_vars).forEach(function(key){
              if(key=='born'){
                var born = session_vars['born'];
                var birthday = new Date(born);
                var ageDifMs = Date.now() - birthday.getTime();
                var ageDate = new Date(ageDifMs);
                var age = Math.abs(ageDate.getUTCFullYear() - 1970);
                session_vars['born'] = born+' ('+age+' y.o.)';
              }
              if($('#var-'+key).length){
                $('#var-'+key+' .var-val').text(session_vars[key]);
              }else{
                $('ul.list').append('<li class="clearfix" id="var-'+key+'"><span class="var-key">'+key+'</span>: <span class="var-val">'+session_vars[key]+'</span></li>');
              }
            });*/
            if(typeof session_vars['action']!=='undefined'){
              switch(session_vars['action']) {
                case 'apply':
                    session_vars['action'] = 'applying for';
                    break;
                case 'transfer':
                    session_vars['action'] = 'transferring';
                    break;
                case 'renew':
                    session_vars['action'] = 'renewing';
                    break;
                case 'upgrade':
                    session_vars['action'] = 'upgrading';
                    break;
                default:
                    session_vars['action'] = null;
                    break;
              }
            }
            if(typeof session_vars['born']!=='undefined'){
              var birthday = new Date(session_vars['born']);
              var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
              var day = birthday.getDate();
              var monthIndex = birthday.getMonth();
              var year = birthday.getFullYear();
              session_vars['born']= day+' '+monthNames[monthIndex]+' '+year;

              /*var ageDifMs = Date.now() - birthday.getTime();
              var ageDate = new Date(ageDifMs);
              session_vars['age'] = Math.abs(ageDate.getUTCFullYear() - 1970);*/
            }
            if(typeof session_vars['category']!=='undefined'){
              if(session_vars['category']=='car') session_vars['category']='car driver\'s';
              if(session_vars['category']=='commercial') session_vars['category']='CDL';
            }

            if(typeof session_vars['resident']!=='undefined' && typeof session_vars['state']!=='undefined'){
              if(session_vars['resident']=='true') session_vars['resident'] = 'is';
              else if(session_vars['resident']=='false') session_vars['resident'] = 'is not';
              /*var first_char = session_vars['state'].charAt(0);
              var vowels = new Array('a','e','i','o','u','A','E','I','O','U');
              if($.inArray(first_char,vowels)) session_vars['state_art']='an';
              else session_vars['state_art']='a';*/
            }
            /*var contextInfo = new Array();
            Object.keys(session_vars).forEach(function(key){
              contextInfo[key] = session_vars[key];
            });
            var templateInfo = Handlebars.compile( $("#info-template").html());
            this.$profileInfo.html(templateInfo(contextInfo));*/
          }
        });
      }).fail(function(){
        this.renderResponse('Sorry, i have encountered a problem when trying to connect to the server. Please come back later.');
      });

    },
    addMessageEnter: function(event) {
        // enter was pressed
        var key = event.which;
        if (key === 13) {
          this.$textarea.blur();
          this.addMessage();
        }
    },
    makeChoice: function(target){
      var choice = $(target).closest('.choice');
      if(choice.text().indexOf('don\'t know yet')!==-1){
        this.addMessage('not sure');
      }else{
        this.addMessage(choice.text());
      }
      $(choice).siblings().removeClass('choice').addClass('choice-made');
      $(choice).removeClass('choice').addClass('choice-made');
      //this.$textarea.prop('disabled', false).attr('placeholder','Type your message');
      this.$textarea.attr('placeholder','Type your message');
    },
    makePhotoChoice: function(target){
      var title = target.title;
      this.addMessage(title);
      $(target).siblings().removeClass('choice-photo').addClass('photo-chosen');
      $(target).removeClass('choice-photo').addClass('photo-chosen');
      //this.$textarea.prop('disabled', false).attr('placeholder','Type your message');
      this.$textarea.attr('placeholder','Type your message');
    },
    startOver: function(){
      //this.endResponse = false;
      if(this.msg_timeout){
        clearTimeout(this.msg_timeout);
        this.msg_timeout = null;
      }
      if(this.awaiting_feedback){
        this.awaiting_feedback = false;
      }
      this.currentNode=0;
      $('.chat-history ul').empty();
      //$('ul.list').empty();
      $('.profile-info').empty();
      //this.$textarea.datepicker('destroy').attr('placeholder','Type your message').off('click.showDatePicker').prop('disabled', false);
      //this.$textarea.attr('placeholder','Type your message').prop('disabled', false);
      this.$textarea.attr('placeholder','Type your message');
      this.$textarea.unmask();
      this.calendarInput = false;
      this.userName = null;
      this.sendWelcomeMessage();
    },
    scrollToBottom: function() {
      /*if(this.waiting){
       this.$chatHistory.scrollTop(this.$chatHistory[0].scrollHeight);
      }else{
        var scrollTo=$('li.chat-block:last-of-type');
        this.$chatHistory.scrollTop(
            scrollTo.offset().top - this.$chatHistory.offset().top + this.$chatHistory.scrollTop()
        );
      }*/
      var scrollTo=$('li.chat-block:last-of-type');
      this.$chatHistory.scrollTop(
          scrollTo.offset().top - this.$chatHistory.offset().top + this.$chatHistory.scrollTop()
      );
    },
    scrollToBottom2: function() {
      var scrollTo=$('li.chat-block:last-of-type >.my-message .waiting');
      var bottom = scrollTo.offset().top + scrollTo.outerHeight() + 20;
      var bottom2 = this.$chatHistory.offset().top + this.$chatHistory.outerHeight();
       this.$chatHistory.scrollTop(
            bottom - bottom2 + this.$chatHistory.scrollTop()
        );
    },
    getCurrentTime: function() {
      return new Date().toLocaleTimeString('en-US').
              replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
    },
    getRandomItem: function(arr) {
      return arr[Math.floor(Math.random()*arr.length)];
    },
    isValidDate: function(dateString){
      if(this.$textarea.attr('type')=='date'){
        if(!/^\d{4}-\d{2}-\d{2}$/.test(dateString))
          return false;
        var parts = dateString.split("-");
        var day = parseInt(parts[2], 10);
        var month = parseInt(parts[1], 10);
        var year = parseInt(parts[0], 10);
        dateString = parts[1]+'/'+parts[2]+'/'+parts[0];
      }else{
      //var today = new Date();
      //var bday = new Date(dateString);
         // First check for the pattern
        if(!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString))
            return false;
        // Parse the date parts to integers
        var parts = dateString.split("/");
        var day = parseInt(parts[1], 10);
        var month = parseInt(parts[0], 10);
        var year = parseInt(parts[2], 10);
      }
      // Check the ranges of month and year
      if(year < 1000 || year > 3000 || month == 0 || month > 12)
          return false;
      var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
      // Adjust for leap years
      if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
          monthLength[1] = 29;
      // Check the range of the day
      if(day > 0 && day <= monthLength[month - 1]){
        return dateString;
      } else return false;
    },
    closeMenu: function(){
      $('#menu_button').removeClass('menu-open');
      var rect = $('.chat-header')[0].getBoundingClientRect();
      var header_height = rect.height;
      $('.chat-header-filler').animate({height: header_height+'px'}, 200, function(){
        $('.chat-header-filler .menu-content').css('margin-top',0);
      });
    },
    sendFeedback: function(chat_block){
      if(chat_block){
        $(chat_block).addClass('highlight');
      }
      var chat_history = document.getElementsByClassName('chat-history');
      chat_history = chat_history[0];
      $('<div id="overlay" data-html2canvas-ignore="true">').appendTo('body');
      var modal = $('<div class="feedback-modal" data-html2canvas-ignore="true"><div class="feedback-header"><a class="feedback-close" href="#">×</a><h3>Send Feedback</h3></div><div class="feedback-body"><div class="feedback-review"></div><div class="feedback-content"><div><input type="text" placeholder="Name" name="user_name" id="user_name"/><input type="text" placeholder="E-mail" name="user_email" id="user_email"/><textarea placeholder="Please describe the issue you are experiencing:"></textarea></div></div></div><div class="feedback-footer"><button class="feedback-btn">Send</button></div></div>');
      modal.appendTo('body');
      var feedback_review = document.getElementsByClassName('feedback-review');
      feedback_review = feedback_review[0];
      //var useHeight = $(chat_history).prop('scrollHeight');
      html2canvas(chat_history, {
        //height: useHeight,
        background: "#F8F8F8",
        /*type: "view",*/
        useCORS: true,
        allowTaint: false,
        logging: false}).then(function(canvas){
        //onrendered: function(canvas) {
          var img = new Image();
          var base64 = img.src = canvas.toDataURL();
          img.style.width = "100%";
          feedback_review.appendChild(img);
          $('.feedback-close').on('click',function(){
            modal.remove();
            $('#overlay').remove();
            $(chat_block).removeClass('highlight');
          });
          $('.feedback-btn').on('click',function(){
            var user_name = $('.feedback-content #user_name').val();
            var user_email = $('.feedback-content #user_email').val();
            var email_correct = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(user_email);
            if(!email_correct){
              alert('Please enter the correct e-mail address');
              return false;
            }
            var feedback_msg = $('.feedback-content textarea').val();
            var feedback_subject = 'Feedback received: ';
            if(this.state) feedback_subject += this.state +' ';
            if(this.category) feedback_subject += this.category;
            $.ajax({
              type: "POST",
              url: "test.quizzie.php",
              data: {
                  feedback: true,
                  feedbackSubject: feedback_subject,
                  feedbackMsg: feedback_msg,
                  userName: user_name,
                  userEmail: user_email,
                  imgBase64: base64
              }
            }).done(function(res) {
              var res_msg;
              if(res){
                res_msg = 'Thank you. Your feedback has been sent.';
              }else{
                res_msg = 'We have encountered problem when sending your feedback.';
              }
              $('.feedback-body').empty().append('<div class="feedback-result">'+res_msg+'</div>');
              $('.feedback-footer').empty();
              setTimeout(function(){
                modal.remove();
                $('#overlay').remove();
              },1500);
              if(chat_block) $(chat_block).removeClass('highlight');
              //console.log(res); 
            });
          }.bind(this));
        }.bind(this));
    },
    addLikes: function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.8&appId=117864028299807";
      fjs.parentNode.insertBefore(js, fjs);
    }

    
  };

  var count = 0;
  
  $('ul.menu li').on('click',function(){
    /*$('ul.menu li.active').removeClass('active');
    $(this).addClass('active');*/
    /*var page_idx = this.id.replace('page_','');
    if(page_idx!=='index'){
      window.open('/'+page_idx+'.html', '_self');
    }*/
  });
  
  chat.init();
  
})();

  $('.chat-history').on('click', '.print', function(){
    /*var html = $(this).parent().parent().html();
    var printWindow = window.open('', '', 'height=400,width=800');
    printWindow.document.write('<html><head><title>DMV Genius</title>');
    printWindow.document.write('</head><body >');
    printWindow.document.write(html);
    printWindow.document.write('</body></html>');
    printWindow.print();
    printWindow.onfocus=function(){ printWindow.close();}*/
    var print_div = $(this).parent().parent();
    var print_title = print_div.data('title');
    if(device.android()) var iframe_print = false;
    else var iframe_print = true;
    print_div.print({
      globalStyles: false,
      noPrintSelector: ".print, .fb-block",
      title: print_title,
      iframe: iframe_print,
      stylesheet: "/css/print.css"
    });
  });
  window.addEventListener("orientationchange", function() {
    var header_height = $('.chat-header').outerHeight();
    $('.chat-header-filler').css('height',header_height+'px');
  });

