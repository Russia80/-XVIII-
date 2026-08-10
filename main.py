import os
import time
import sys

# --- ГЛОБАЛЬНЫЙ РЕЕСТР ПРОТОКОЛА ---
# Начальные значения параметров героя
stats = {
    "dynasty": 50,   # Род: репутация семьи
    "honor": 50,     # Честь: доверие общества
    "interest": 10   # Интерес: прагматичный ресурс/власть
}

current_act = "АКТ I: ЗАООЗЕРЬЕ (1764)"
protocol_log = []  # Журнал событий для дебага

def clear_screen():
    """Очистка терминала для смены сцен"""
    os.system('cls' if os.name == 'nt' else 'clear')

def log_protocol(event, result, details=""):
    """Запись любого действия в консенсус-лог Меридиана"""
    entry = f"[{event}] -> {result}"
    if details:
        entry += f" | {details}"
    protocol_log.append(entry)

def check_threshold(stat_name, value):
    """Проверка параметра перед выполнением сложного действия"""
    if stats[stat_name] >= value:
        return True
    print(f"\n⛔ МЕРИДИАН ОТКЛОНЯЕТ: Недостаточно {stat_name.capitalize()}.")
    log_protocol("SYSTEM", "REJECTED", f"{stat_name} need {value}, have {stats[stat_name]}")
    time.sleep(2)
    return False

# --- СЦЕНЫ АКТА I ---

def opening_scene():
    """Завязка: смерть отца и тишина"""
    clear_screen()
    border = "═" * 50
    print(border)
    print(f"{current_act}")
    print(border + "\n")
    
    text = ("Ты просыпаешься от тишины. Непривычной, звенящей тишины летнего полдня.\n"
            "Отец Владимир сидит у постели, перебирая кипарисовые четки.")
    for char in text:
        print(char, end='', flush=True); time.sleep(0.01)
        
    input("\n\n[Нажмите Enter]")
    
    dialogue = ('— Тише... раба Божьего Алексея Господь призвал... '
                'Он прохрипел: «Скажи сыну... пусть не верит тому, что железо обещает даром.')
    for char in dialogue:
        print(char, end='', flush=True); time.sleep(0.01)

def ending_scene():
    """Вывод итогов Акта I"""
    clear_screen()
    print(border)
    print("РЕЗУЛЬТАТЫ ПРОВЕРКИ КОНСЕНСУСА:")
    print(f"РОД       : {stats['dynasty']}/100")
    print(f"ЧЕСТЬ     : {stats['honor']}/100")
    print(f"ИНТЕРЕС   : {stats['interest']}/100")
    print("\nЖурнал событий Протокола:")
    for entry in protocol_log:
        print(f" • {entry}")
    print("\nСанкт-Петербург встречает вас запахом гниющего дерева...")
    print("[КОНЕЦ АКТА I]")
    sys.exit()

# --- ВЕТВИ ВЫБОРА (Путь героя) ---

def path_scholar():
    """Открыть сундук"""
    log_protocol("CHOICE", "APPROVED", "Path: Scholar")
    stats["interest"] += 20
    print("\n✅ ИНТЕРЕС повышен (+20). Ты чувствуешь зов столицы.")
    ending_scene()

def path_faith():
    """Идти к священнику"""
    log_protocol("CHOICE", "APPROVED", "Path: Faith")
    stats["honor"] += 20
    print("\n✅ ЧЕСТЬ повышена (+20). Мирская суета больше не имеет власти над тобой.")
    ending_scene()

def path_diplomat():
    """Найти управляющего"""
    log_protocol("CHOICE", "APPROVED", "Path: Diplomat")
    stats["dynasty"] += 10
    stats["interest"] += 10
    print("\n✅ РОД (+10) и ИНТЕРЕС (+10) повышены. Ты курьер Коллегии.")
    ending_scene()

def path_community():
    """Собрать сход"""
    log_protocol("CHOICE", "APPROVED", "Path: Community")
    stats["honor"] += 30
    print("\n✅ ЧЕСТЬ повышена значительно (+30). Община признала тебя вождем.")
    ending_scene()

# --- ЗАПУСК ДВИГАТЕЛЯ ---

if __name__ == "__main__":
    opening_scene()
    
    while True:
        print("\n═══ ТВОЙ ВЫБОР ═══\n")
        print("А. Открыть сундук (Путь Знаний)")
        print("Б. Идти к отцу Владимиру (Путь Веры)")
        print("В. Найти управляющего Иоганна (Путь Разума)")
        print("Г. Собрать сход односельчан (Путь Земли)\n")
        
        choice = input(">>> ").upper()
        
        if choice == "А":
            path_scholar(); break
        elif choice == "Б":
            path_faith(); break
        elif choice == "В":
            path_diplomat(); break
        elif choice == "Г":
            path_community(); break
        else:
            print("Мерзлый ветер воет за окном. Сделай выбор.")
