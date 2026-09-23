#Task 1 (Programming and logical Thinking)

#A.Duplicate Values

numbers=[10,20,30,20,40,10,50,30]
duplicate_numbers=[]

for nums in numbers:
    if numbers.count(nums)>1 and nums not in duplicate_numbers:
        duplicate_numbers.append(nums)


print("Duplicate Values:",duplicate_numbers)

#B.String Reversal

Word="Backend Developer"

Reverse_Word=""

for i in range(len(Word)-1,-1,-1):
    Reverse_Word=Reverse_Word + Word[i]

print("Reversed Word:", Reverse_Word)


#C.Max Value


Numbers=[12,45,7,89,34,23]
Largest_Number=Numbers[0]

for Nums in Numbers:
    if Nums>Largest_Number:
        Largest_Number=Nums

print("Largest Number:" ,Largest_Number)        


#D explanation and Time Complexity
print("For finding the Largest Number, I declared the first index of Numbers to be the Largest Number.I then simply compared the numbers in the list with the Largest Number using a greater then condition." )
print("If there was a Number greater then the Largest Number, we made it the largest Number")
print("The time complexity would be o(n) since we are looping through the list once")