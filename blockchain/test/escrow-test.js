const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Escrow", function () {
  let Escrow, escrow, owner, student, other;

  beforeEach(async function () {
    [owner, student, other] = await ethers.getSigners();
    Escrow = await ethers.getContractFactory("Escrow");
    escrow = await Escrow.deploy();
    await escrow.deployed();
  });

  it("allows student to create escrow and owner to confirm release", async function () {
    const bookingId = 1;
    const deposit = ethers.utils.parseEther("0.1");

    // student creates escrow
    await expect(
      escrow
        .connect(student)
        .createEscrow(bookingId, owner.address, { value: deposit }),
    ).to.emit(escrow, "Created");

    const b = await escrow.getBooking(bookingId);
    expect(b.student).to.equal(student.address);
    expect(b.owner).to.equal(owner.address);

    // owner confirms
    await expect(escrow.connect(owner).confirmStay(bookingId)).to.emit(
      escrow,
      "Released",
    );
  });

  it("allows student to cancel before confirmation and receive refund", async function () {
    const bookingId = 2;
    const deposit = ethers.utils.parseEther("0.05");

    await escrow
      .connect(student)
      .createEscrow(bookingId, owner.address, { value: deposit });

    // cancel and refund
    await expect(escrow.connect(student).cancel(bookingId)).to.emit(
      escrow,
      "Cancelled",
    );
  });
});
