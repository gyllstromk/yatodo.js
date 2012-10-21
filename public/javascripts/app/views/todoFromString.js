define('app/views/todoFromString', function() {
    return function todoFromString(value) {
        var title = [], tags = [], due;

        value.split(' ').forEach(function(word) {
            if (word[0] === ':') {
                tags.pushObject(word.slice(1));
            } else if (word[0] === '@') {
                word = word.slice(1);
                var date, time;

                if (word.indexOf('|') !== -1) {
                    var tokens = word.split('|');
                    date = tokens[0];
                    time = tokens[1];
                } else {
                    date = word;
                }

                var dayMonth = date.split('/').map(function(token) {
                    return parseInt(token, 10);
                });

                console.log('dayMonth', dayMonth);

                var hourMinute = time ? time.split(':').map(function(token) {
                    return parseInt(token, 10);
                }) : null;

                if (dayMonth.length === 2) {
                    due = new Date(new Date().getFullYear(), dayMonth[1] - 1, dayMonth[0]);

                    if (due.isPast()) {
                        due = due.addYears(1);
                    }
                } else {
                    due = new Date(dayMonth);
                }

                if (hourMinute) {
                    due = due.set({ hour: hourMinute[0], minute: hourMinute[1] });
                    console.log(due);
                }
            } else {
                title.pushObject(word);
            }
        });

//         var currentTag = App.get('router.currentTag');
//         if (currentTag && tags.indexOf(currentTag) === -1) {
//             tags.push(currentTag);
//         }

        return { title: title.join(' '), tags: tags, due: due };
    };
});
