var canJump = function (nums) {
    let index = nums.length - 1;
    for (let i = nums.length - 1; i >= 0; i--) {
        if (nums[i] + i >= index) {
            index = i;
        }
    }
    
    return index === 0;
};