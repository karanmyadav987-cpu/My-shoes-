# Program to check room temperature

temperature = float(input("Enter the room temperature (°C): "))

if temperature == 30:
    print("Your room temperature is normal.")
elif temperature > 30 and temperature <= 50:
    print("Your room temperature is too hot.")
else:
    print("Your room temperature is extreme hot")

    