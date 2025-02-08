import matplotlib.pyplot as plt # type: ignore
import json

def draw_line(coordinates):
    # Convert to (x, -y) system
    x_vals, y_vals = zip(*[(x, -y) for x, y in coordinates])  
    
    plt.plot(x_vals, y_vals, marker='o', linestyle='-', color='g', markersize=4)

    plt.text(65, -460, 'START', fontsize = 10, bbox = dict(facecolor = 'yellow', alpha = 0.3))
    plt.text(700, -120, 'YES', fontsize = 10, bbox = dict(facecolor = 'yellow', alpha = 0.3))
    plt.text(750, -120, 'NO', fontsize = 10, bbox = dict(facecolor = 'yellow', alpha = 0.3))
    
    plt.title("Mouse Movement Pattern")
    plt.xlabel("X-axis")
    plt.ylabel("Y-axis")
    plt.grid(True)

    plt.savefig("mouse_pattern.png")
    
    plt.show()

# Read coordinates from JSON file
def read_coordinates_from_json(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data["mouseMovements"]

# Example usage
file_path = "questionnaire_sessions\session_1738979292513\question_Do_you_like_traveling_.json"
mouseMovements = read_coordinates_from_json(file_path)
draw_line(mouseMovements)
