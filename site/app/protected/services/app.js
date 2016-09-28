'use strict';

angular.module('AppBook.Service.App', [])

.service('AppService', function() {
	var User = {};

	return {
		contacts: {
			phone: 'Городской телефон',
			cellphone: 'Мобильный телефон',
			email: 'E-mail',
			skype: 'Скайп',
			notes: 'Заметка',
			fax: 'Факс',
			icq: 'ICQ',
			viber: 'Viber',
			telegram: 'Telegram',
			site: 'Сайт'
		},

		setUser: function(u)
		{
			User = u;
		},
		getUser: function()
		{
			return User;
		}
	}
})
