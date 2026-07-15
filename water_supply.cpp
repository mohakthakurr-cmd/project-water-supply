#include <iostream>
using namespace std;

int main() {
    int waterLevel;

    cin >> waterLevel;

    if (waterLevel >= 70) {
        cout << "Good";
    }
    else if (waterLevel >= 40) {
        cout << "Medium";
    }
    else {
        cout << "Low";
    }

    return 0;
}