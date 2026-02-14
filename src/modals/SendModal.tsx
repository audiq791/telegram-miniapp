"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Search, 
  QrCode, 
  ChevronDown,
  ArrowUpRight,
  User,
  Wallet
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { partnersSeed } from "../data/partners";

type SendModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSend: (data: { recipient: string; partner: string; amount: number }) => void;
  currentBalance?: number;
};

// Тип для контакта
type Contact = {
  id: string;
  name: string;
  bonAddress?: string;
  phone?: string;
};

export default function SendModal({ isOpen, onClose, onSend, currentBalance = 1843 }: SendModalProps) {
  const [step, setStep] = useState<"recipient" | "amount">("recipient");
  const [recipientInput, setRecipientInput] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [bonAddress, setBonAddress] = useState("");
  const [selectedPartner, setSelectedPartner] = useState(partnersSeed[0]);
  const [amount, setAmount] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showPartnerDropdown, setShowPartnerDropdown] = useState(false);
  const [isManualAddress, setIsManualAddress] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Имитация загрузки контактов (в реальном приложении будет через Cordova/Capacitor)
  useEffect(() => {
    // Демо-контакты
    setContacts([
      { id: "1", name: "Анна Иванова", bonAddress: "ANNA2024", phone: "+7 (999) 123-45-67" },
      { id: "2", name: "Сергей Петров", bonAddress: "SERGEY_P", phone: "+7 (999) 234-56-78" },
      { id: "3", name: "Елена Смирнова", bonAddress: "ELENA_S", phone: "+7 (999) 345-67-89" },
      { id: "4", name: "Дмитрий Козлов", bonAddress: "DIMON88", phone: "+7 (999) 456-78-90" },
      { id: "5", name: "Ольга Новикова", bonAddress: "OLGA_N", phone: "+7 (999) 567-89-01" },
    ]);
  }, []);

  // Фильтрация контактов по вводу
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(recipientInput.toLowerCase()) ||
    (contact.bonAddress?.toLowerCase().includes(recipientInput.toLowerCase()))
  );

  // Выбор контакта
  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    if (contact.bonAddress) {
      setBonAddress(contact.bonAddress);
      setIsManualAddress(false);
    } else {
      setIsManualAddress(true);
      setBonAddress("");
    }
    setStep("amount");
    setRecipientInput("");
  };

  // Ручной ввод адреса
  const handleManualAddress = () => {
    setIsManualAddress(true);
    setSelectedContact(null);
    setBonAddress("");
  };

  // Подтверждение ручного адреса
  const handleConfirmManualAddress = () => {
    if (bonAddress.trim()) {
      // Здесь можно сохранить адрес для контакта
      setStep("amount");
    }
  };

  // Сканирование QR
  const handleScanQR = () => {
    // В реальном приложении здесь будет вызов нативного сканера
    alert("Открытие сканера QR-кодов");
    // Имитация получения адреса из QR
    setTimeout(() => {
      setBonAddress("USER_QR_123");
      setIsManualAddress(false);
      setStep("amount");
    }, 1000);
  };

  // Выбор партнера
  const handleSelectPartner = (partner: typeof partnersSeed[0]) => {
    setSelectedPartner(partner);
    setShowPartnerDropdown(false);
  };

  // Отправка
  const handleSend = () => {
    if (amount && bonAddress && selectedPartner) {
      onSend({
        recipient: selectedContact?.name || bonAddress,
        partner: selectedPartner.displayName || selectedPartner.name,
        amount: parseFloat(amount)
      });
      resetModal();
      onClose();
    }
  };

  // Сброс модалки
  const resetModal = () => {
    setStep("recipient");
    setRecipientInput("");
    setSelectedContact(null);
    setBonAddress("");
    setAmount("");
    setIsManualAddress(false);
  };

  // Закрытие с анимацией
  const handleClose = () => {
    resetModal();
    onClose();
  };

  // Оставшийся баланс после перевода
  const remainingBalance = currentBalance - (parseFloat(amount) || 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Затемнение фона */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Модальное окно */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-3xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Шапка */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-100">
              <h2 className="text-lg font-semibold">Перевод</h2>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition-colors"
              >
                <X size={18} />
              </motion.button>
            </div>

            {/* Контент */}
            <div className="p-4 max-h-[70vh] overflow-y-auto">
              <AnimatePresence mode="wait">
                {step === "recipient" ? (
                  <motion.div
                    key="recipient"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {/* Поле ввода получателя */}
                    <div className="relative">
                      <div className="flex items-center gap-2 p-3 border border-zinc-200 rounded-2xl focus-within:ring-2 focus-within:ring-zinc-900/10">
                        <Search size={20} className="text-zinc-400" />
                        <input
                          ref={inputRef}
                          type="text"
                          value={recipientInput}
                          onChange={(e) => setRecipientInput(e.target.value)}
                          placeholder="Введите имя контакта или BON-Адрес"
                          className="flex-1 outline-none bg-transparent text-[15px]"
                          autoFocus
                        />
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={handleScanQR}
                          className="h-9 w-9 rounded-xl bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition-colors"
                        >
                          <QrCode size={18} />
                        </motion.button>
                      </div>
                    </div>

                    {/* Контакты */}
                    {recipientInput && filteredContacts.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-xs text-zinc-500 px-1">Контакты</div>
                        {filteredContacts.map(contact => (
                          <motion.button
                            key={contact.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSelectContact(contact)}
                            className="w-full p-3 rounded-2xl bg-white border border-zinc-200 flex items-center gap-3 hover:border-zinc-300 transition-colors text-left"
                          >
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-zinc-200 to-zinc-300 flex items-center justify-center">
                              <User size={18} className="text-zinc-600" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{contact.name}</div>
                              {contact.bonAddress && (
                                <div className="text-xs text-zinc-500">BON: {contact.bonAddress}</div>
                              )}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    )}

                    {/* Ручной ввод адреса */}
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleManualAddress}
                      className="w-full p-3 rounded-2xl border border-dashed border-zinc-300 flex items-center justify-center gap-2 text-zinc-600 hover:border-zinc-400 transition-colors"
                    >
                      <span className="text-sm">Ввести BON-Адрес вручную</span>
                    </motion.button>

                    {/* Поле ручного ввода адреса */}
                    {isManualAddress && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                      >
                        <input
                          type="text"
                          value={bonAddress}
                          onChange={(e) => setBonAddress(e.target.value)}
                          placeholder="Введите BON-Адрес"
                          className="w-full p-3 border border-zinc-200 rounded-2xl outline-none focus:ring-2 focus:ring-zinc-900/10 text-[15px]"
                          autoFocus
                        />
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          onClick={handleConfirmManualAddress}
                          disabled={!bonAddress.trim()}
                          className="w-full py-3 bg-zinc-900 text-white rounded-2xl font-medium disabled:opacity-50 disabled:bg-zinc-300"
                        >
                          Продолжить
                        </motion.button>
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="amount"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {/* Информация о получателе */}
                    <div className="p-3 bg-zinc-50 rounded-2xl">
                      <div className="text-xs text-zinc-500 mb-1">Получатель</div>
                      <div className="font-medium">{selectedContact?.name || bonAddress}</div>
                      {selectedContact?.bonAddress && (
                        <div className="text-xs text-zinc-500 mt-1">BON: {selectedContact.bonAddress}</div>
                      )}
                    </div>

                    {/* Выбор партнера */}
                    <div className="relative">
                      <div className="text-xs text-zinc-500 mb-1">Перевести бонусы</div>
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowPartnerDropdown(!showPartnerDropdown)}
                        className="w-full p-3 border border-zinc-200 rounded-2xl flex items-center justify-between gap-2 hover:border-zinc-300 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-white border border-zinc-200 overflow-hidden">
                            {selectedPartner.logo && (
                              <img src={selectedPartner.logo} alt="" className="w-full h-full object-contain p-1" />
                            )}
                          </div>
                          <span className="font-medium">{selectedPartner.displayName || selectedPartner.name}</span>
                        </div>
                        <ChevronDown size={18} className={`text-zinc-400 transition-transform ${showPartnerDropdown ? 'rotate-180' : ''}`} />
                      </motion.button>

                      <AnimatePresence>
                        {showPartnerDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-10 w-full mt-1 bg-white border border-zinc-200 rounded-2xl shadow-lg"
                          >
                            {partnersSeed.slice(0, 5).map(partner => (
                              <button
                                key={partner.id}
                                onClick={() => handleSelectPartner(partner)}
                                className="w-full p-3 flex items-center gap-2 hover:bg-zinc-50 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                              >
                                <div className="h-8 w-8 rounded-lg bg-white border border-zinc-200 overflow-hidden">
                                  {partner.logo && (
                                    <img src={partner.logo} alt="" className="w-full h-full object-contain p-1" />
                                  )}
                                </div>
                                <span className="font-medium">{partner.displayName || partner.name}</span>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Сумма перевода */}
                    <div>
                      <div className="text-xs text-zinc-500 mb-1">Сумма перевода</div>
                      <div className="relative">
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0"
                          className="w-full p-3 pr-12 border border-zinc-200 rounded-2xl outline-none focus:ring-2 focus:ring-zinc-900/10 text-[15px]"
                          autoFocus
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">B</span>
                      </div>
                    </div>

                    {/* Информация о балансе */}
                    <div className="space-y-2 p-3 bg-zinc-50 rounded-2xl">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-zinc-600">Ваш баланс</span>
                        <span className="font-medium">{currentBalance} B</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-zinc-600">После перевода</span>
                        <span className={`font-medium ${remainingBalance < 0 ? 'text-red-600' : ''}`}>
                          {remainingBalance} B
                        </span>
                      </div>
                    </div>

                    {/* Кнопки действий */}
                    <div className="flex gap-3 pt-2">
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={handleClose}
                        className="flex-1 py-3 rounded-2xl border border-zinc-200 font-medium hover:bg-zinc-50 transition-colors"
                      >
                        Отменить
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={handleSend}
                        disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > currentBalance}
                        className="flex-1 py-3 rounded-2xl bg-zinc-900 text-white font-medium disabled:opacity-50 disabled:bg-zinc-300"
                      >
                        Отправить
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}