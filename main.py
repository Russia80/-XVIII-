import os
import time
import sys

BORDER = "═" * 50

stats = {
    "dynasty": 50,
    "honor": 50,
    "interest": 10
}

current_act = "АКТ I: ЗАОЗЕРЬЕ"
protocol_log = []

def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')

def log(event, result):
    protocol_log.append(f"[{event}] -> {result}")

def print_header(text):
    clear_screen()
    print(BORDER)
    print(text.center(50))
    print(BORDER + "\n")

def ending_game(reason="Игра прервана"):
    clear_screen()
    print("═" * 50)
    print("ПРОТОКОЛ МЕРИДИАН ОКОНЧЕН".center(50))
    print("═" * 50 + "\n")
    print(f"Итог: {reason}")
    total = stats['dynasty'] + stats['honor'] + stats['interest']
    print(f"\nОбщий индекс влияния: {total}/300")
    if total > 250: print("\nТитул: Архитектор Нового Мира")
    elif total > 200: print("\nТитул: Кавалер Империи")
    else: print("\nТитул: Действительный Статский Советник")
    
    print("\nЖурнал событий:")
    for entry in protocol_log:
        print(f" • {entry}")
    
    input("\n[Нажми Enter для выхода]")
    sys.exit()

def opening_scene():
    print_header(current_act)
    text = ("Стук дождя смолкает. Тишина.\nОтец Владимир сидит у постели.")
    for char in text: print(char, end='', flush=True); time.sleep(0.02)
    input("\n\n[Нажмите Enter]")
    dialogue = ('— Тише... раба Божьего Алексея Господь призвал... '
                'Он прохрипел: «Пусть сын не верит тому, что железо обещает даром.')
    for char in dialogue: print(char, end='', flush=True); time.sleep(0.02)

def end_act_i():
    print(BORDER)
    print("РЕЗУЛЬТАТЫ КОНСЕНСУСА:")
    print(f"РОД       : {stats['dynasty']}/100")
    print(f"ЧЕСТЬ     : {stats['honor']}/100")
    print(f"ИНТЕРЕС   : {stats['interest']}/100")
    print("\nЖурнал событий:")
    for entry in protocol_log:
        print(f" • {entry}")
    
    choice = input("\nВойти в Уездный город? [Y/N]: ").upper()
    if choice == "Y": 
        act_ii_town()
    else: 
        ending_game("Вы остались в деревне навсегда.")

def act_ii_town():
    clear_screen()
    print_header("АКТ II: ТОРГОВЫЕ РЯДЫ")
    text = ("Запах кожи, рыбы и ладана. Каменные соборы.\nКупец смотрит на тебя оценивающе.")
    for char in text: print(char, end='', flush=True); time.sleep(0.02)
    input("\n\n[Нажмите Enter]")
    
    print("\n═══ ВЫБОР ═══")
    print("А. По закону")
    print("Б. По обычаю")
    print("В. По знакомству\n")
    
    c = input(">>> ").upper()
    if c == "А": 
        stats["honor"] += 15
        log("ACT_II", "Law")
        print("\n✅ Честь (+15)")
    elif c == "Б": 
        stats["interest"] += 25
        log("ACT_II", "Custom")
        print("\n✅ Интерес (+25)")
    elif c == "В": 
        stats["dynasty"] += 20
        log("ACT_II", "Connections")
        print("\n✅ Род (+20)")
    else: 
        print("Ошибка.")
        return
    
    print("\nТы успешно доставил груз. Путь лежит в столицу...")
    input("[Enter]")
    act_iii_capital()

def act_iii_capital():
    print_header("АКТ III: ГРАНИТ ИМПЕРИИ")
    text = ("Холод Нивы. Блеск шпаг.\nИнтриги при дворе требуют осторожности.")
    for char in text: print(char, end='', flush=True); time.sleep(0.02)
    input("\n\n[Нажмите Enter]")
    
    print("\n═══ ИНТРИГА ═══")
    print("А. Ода государыне")
    print("Б. Дуэль за честь дамы")
    print("В. Казначейство империи\n")
    
    c = input(">>> ").upper()
    if c == "А": 
        stats["dynasty"] += 30
        log("ACT_III", "Ode")
        print("\n✅ Род (+30)")
    elif c == "Б": 
        stats["honor"] += 25
        log("ACT_III", "Duel")
        print("\n✅ Честь (+25)")
    elif c == "В": 
        stats["interest"] += 35
        log("ACT_III", "Treasury")
        print("\n✅ Интерес (+35)")
    else: 
        print("Ошибка.")
        return
    
    print("\nНазначение: Посол...")
    input("[Enter]")
    act_iv_europe()

def act_iv_europe():
    print_header("АКТ IV: ЕВРОПЕЙСКИЕ ДЕЛА")
    text = ("Вена тонет в вальсах. Париж — в порохе.\nНужно выбрать союзника Турции.")
    for char in text: print(char, end='', flush=True); time.sleep(0.02)
    input("\n\n[Нажмите Enter]")
    
    print("\n═══ СОЮЗ ═══")
    print("А. Австрия")
    print("Б. Франция")
    print("В. Пруссия\n")
    
    c = input(">>> ").upper()
    if c == "А": 
        stats["dynasty"] += 20
        log("ACT_IV", "Austria")
        print("\n✅ Род (+20)")
    elif c == "Б": 
        stats["honor"] += 20
        log("ACT_IV", "France")
        print("\n✅ Честь (+20)")
    elif c == "В": 
        stats["interest"] += 20
        log("ACT_IV", "Prussia")
        print("\n✅ Интерес (+20)")
    else: 
        print("Ошибка.")
        return
    
    print("\nРазделы Польши состоялись. Время плыть на Восток...")
    input("[Enter]")
    act_v_china()

def act_v_china():
    print_header("АКТ V: НЕБЕСНАЯ ИМПЕРИЯ")
    text = ("Запретный Город. Мандарины смотрят сквозь тебя.\nЗдесь правит ритуал, а не закон.")
    for char in text: print(char, end='', flush=True); time.sleep(0.02)
    input("\n\n[Нажмите Enter]")
    
    print("\n═══ ЦЕРЕМОНИЯ ═══")
    print("А. Сложить дары")
    print("Б. Склониться")
    print("В. Дарить механизмы\n")
    
    c = input(">>> ").upper()
    if c == "А": 
        stats["interest"] += 25
        log("ACT_V", "Gifts")
        print("\n✅ Интерес (+25)")
    elif c == "Б": 
        stats["honor"] += 30
        log("ACT_V", "Kowtow")
        print("\n✅ Честь (+30)")
    elif c == "В": 
        stats["dynasty"] += 25
        log("ACT_V", "Clocks")
        print("\n✅ Род (+25)")
    else: 
        print("Ошибка.")
        return
    
    print("\nЧайный договор подписан. Путь лежит через океан...")
    input("[Enter]")
    act_vi_usa()

def act_vi_usa():
    print_header("АКТ VI: ЗЕМЛЯ СВОБОДЫ")
    text = ("Филадельфия. Говорят о правах человека.\nВаш суверен — абсолютный монарх.")
    for char in text: print(char, end='', flush=True); time.sleep(0.02)
    input("\n\n[Нажмите Enter]")
    
    print("\n═══ ДИЛЕММА ═══")
    print("А. Верность присяге")
    print("Б. Помощь борцам")
    print("В. Торговая сделка\n")
    
    c = input(">>> ").upper()
    if c == "А": 
        stats["dynasty"] += 40
        log("ACT_VI", "Loyalty")
        print("\n✅ Род (+40)")
    elif c == "Б": 
        stats["honor"] += 40
        log("ACT_VI", "Liberty")
        print("\n✅ Честь (+40)")
    elif c == "В": 
        stats["interest"] += 40
        log("ACT_VI", "Trade")
        print("\n✅ Интерес (+40)")
    else: 
        print("Ошибка.")
        return
    
    print("\nЧерноморский флот заложен. Протокол завершен.")
    input("[Enter]")
    ending_game("Миссия выполнена.")

# Пути первого акта
def path_scholar(): 
    stats["interest"] += 20
    log("CHOICE", "Scholar")
    print("\n✅ ИНТЕРЕС (+20)")
    end_act_i()

def path_faith(): 
    stats["honor"] += 20
    log("CHOICE", "Faith")
    print("\n✅ ЧЕСТЬ (+20)")
    end_act_i()

def path_diplomat(): 
    stats["dynasty"] += 10
    stats["interest"] += 10
    log("CHOICE", "Diplomat")
    print("\n✅ РОД/ИНТЕРЕС (+10/+10)")
    end_act_i()

def path_community(): 
    stats["honor"] += 30
    log("CHOICE", "Community")
    print("\n✅ ЧЕСТЬ (+30)")
    end_act_i()

# === ГЛАВНЫЙ ЗАПУСК ===
if __name__ == "__main__":
    opening_scene()
    
    while True:
        print(f"\n{BORDER}\n")
        print("А. Сундук [Знания]")
        print("Б. Священник [Вера]")
        print("В. Управляющий [Разум]")
        print("Г. Сход [Земля]\n")
        
        choice = input(">>> ").upper()
        if choice == "А": 
            path_scholar()
            break
        elif choice == "Б": 
            path_faith()
            break
        elif choice == "В": 
            path_diplomat()
            break
        elif choice == "Г": 
            path_community()
            break
        else: 
            print("Сделай выбор.")
