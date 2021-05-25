G.F_EN_RU = function (arr_of_strings_en_ru) {
    this.en = arr_of_strings_en_ru[0];
    this.ru = arr_of_strings_en_ru[1];
}

G.LANG = {
    en_ru: "ru",

    info_process: new G.F_EN_RU(["Game Solitaire 64","Игра Солитер 64"]),
    info_win: new G.F_EN_RU(["You win!","ПОБЕДА!"]),
    info_loser: new G.F_EN_RU(["Try again.","Сыграй заново."]),

    //if 0, game in process; if 1, you win; if 2 or more, you lose
    f_n_to_info: function (n) {
        if (n === 1) {return G.LANG.info_win[G.LANG.en_ru]; };
        if (n > 1) {return G.LANG.info_loser[G.LANG.en_ru]; };
        return G.LANG.info_process[G.LANG.en_ru];
    },

    BUTTONS: {
        arr_names: ["game_new", "game_restart", "move_back", "move_forward"],
        
        game_new: new G.F_EN_RU(["new game", "новая игра"]),
        game_restart: new G.F_EN_RU(["try again", "заново"]),

        move_back: new G.F_EN_RU(["move undo", "ход назад"]),
        move_forward: new G.F_EN_RU(["extra button", "запасная кнопка"])
    }
};