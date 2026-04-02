import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    tvaRate: 20, // Default TVA
    alertThresholds: {
      retourContrat: 3,
      finVisiteTechnique: 7,
      finAssurance: 7,
      finAssistance: 7,
      finCarteGrise: 7,
      finAutorisation: 7,
      kmAvantEntretien: 1000,
      entretienParDate: 15,
      prochaineTraite: 7,
      reservation: 3,
      tacheProgrammee: 3,
      active: true
    },
    conditionsGenerales: {
      fr: `article 1: utilisation de voiture\n-le locataire s'engage à ne pas laisser conduire la voiture que par ceux désignés au contrat.\n-ne pas utiliser le véhicule à des fins illicites ou pour le transport de marchandises interdites le remorquage, ou le transport des personnes à contre partie -ne pas utiliser les petites voitures dans les pistes .\n\narticle 2 : état de voiture\n-le véhicule est livré en partfaite état de propreté mécanique, életrique pneumatique ; doit être rendu dans les mêmes conditions\n-le kilométrage est fixé à 250km/jour. en cas de dépassement de cette valeur , le locataire paiera 01 dh pour chaque kilomètre de plus .\n\narticles 3 : entretien et réparation\n-toute opération, d'entretien ou de réparation, prévue du véhicule, doit être accordée par l'agence de location soit par fax soit par email.\n-tous panne causée par l'inconsciemment du client la facturation sera à sa charge.\n\narticle 4 : assurance\n1-assurance tout risques:\n-si le locataire est fautif il doit soumis à payer une franchise déterminée par la compagnie d'assurance en plus les frais d'immobilisation de la voiture pendant les jours de réparations.\n-le locataire doit aviser, immédiatement, l'agence en cas d'accident.\n2-assurance normal:\n-le locataire est le responsable unique en cas d'accident, et il est obliger de payer toutes les charges et les jours arréter de la voiture.\n\narticles5: location prolongation\n-toute prolongation doit être accordée par l'agence de location. faute de cela le locataire est responsable de tous les frais causés par sa négligence .\n-en cas de prologation le locataire doit aviser 1 jour à l'avance.\n-le locataire doit rende le véhicule en temps réel de la livraison. pour tout retard (plus de 2heures), une journée sera facturée.\n-la société se réserve le plein droit de mettre fin au statut du contrat sans justification ni compensation, ne rembourse pas dans le cas ou le locataire n'a pas respecté les termes de ce contrat.\n-dans le cas d'un retour, le locataire n'a pas le droit d'aucun remboursement. -dans le cas d'une prolongation de contrat non autorisée par l'agence, le client doit payer a l'agence 100 dirhams pour chaque heure jusqu'a la reprise de la voiture.\n\narticle 6 :papiers de la voiture\n-en cas de perte de papiers de voiture toutes les charges et les frais sont à la charge du locataire (un mobilisation du véhicule renouvellement de papier...) \n\narticle 7 : responsabilité\n-le locataire est responsable des amendes, contravention et procès verbaux établis contre lui par les autorités.\n-le conducteur restera le responsable financièrement des dommages causés au véhicule .\n-le locataire ne doit pas renoncer à la voiture, quelle que soit les raisons d'arrêt.\n\narticle 8: annulation du droit de locataire\n-tous les droits du locataire que lui sont accordés en vartu du présent contrat seront exclus dans le cas de non respect d'un acte du contrat sans pretendre à aucune idemnité pour la durée restante du contrat de location.\n\narticle 9: litiges\n-toutes les contestations pouvant naitre entre la société de location et le locataire sont de la compétence exclusive du siège social de la dite société.`,
      ar: `البند 1 : استعمال السيارة\nلا يسمح بسياقة السيارة إلا من طرف الأشخاص المحددة أسماؤهم في العقد.\nلا يسمح باستخدام السيارة لأغراض غير مشروعة، نقل البضائع الممنوعة، جر العربات أو نقل الأشخاص بمقابل.\nيمنع استعمال السيارات الخفيفة في الطرق غير المعبدة.\n\nالبند 2: حالة السيارة:\nتسلم السيارة في حالة جيدة(النظافة، الحالة الميكانيكية، الأضواء، العجلات) على أن تعاد في نفس الحالة و نفس الشروط.\nالمسافة المسموح بها في كل يوم محددة في 250 كلم، و كل تجاوز لهذه المسافة يؤدى عنها 01 درهم عن كل كلم.\n\nالبند 3: الصيانة و الإصلاح :\nللقيام بأي عملية صيانة أو إصلاح بالسيارة، يجب الحصول على موافقة وكالة التأجير عن طريق الفاكس أو البريد الإلكتروني.\nأي عطب ناجم عن اللامبالاة من طرف المستأجر، يلزمه أداء كل النفقات المترتبة عن ذلك.\n\nالبند 4: التأمين:\n1- التأمين عن كل المخاطر :\nإذا ثبتت مسؤولية المستأجر في حادثة سير، سيكون ملزما بأداء مبلغ قيمة الخصم المؤمن له من طرف شركة التأمين، بالإضافة إلى المصاريف الناجمة عن توقف السيارة خلال فترة الإصلاح.\nيجب على المستأجر إخبار وكالة التأجير فور حدوث حادثة سير.\n2- التأمين العادي:\nالمستأجر هو المسؤول الوحيد في حالة حادثة سير، و هو ملزم بأداء جميع مصاريف الإصلاح و التعويض عن فترة توقف السيارة للإصلاح.\n\nالبند 5 : التمديد\nلا يمكن تمديد عملية الإيجار إلا بموافقة الوكالة، و إلا سيتحمل المستأجر كل المصاريف الناتجة عن هذا الإهمال.\nفي حالة التمديد، يتعين على المستأجر إخبار الوكالة بيوم واحد.\nيجب على المستأجر إرجاع السيارة في الوقت المحدد، وأي تأخير (في حدود ساعتين) يحتسب يوما إضافيا يؤديه المستأجر.\nتحتفظ الشركة بكامل حق وضع نهاية العقد دون تبرير و لا تعويض و لا سداد في حالة خرق المستأجر لأحد بنود هذا العقد.\nفي حالة إرجاع سابق لأوانه لا يمكن للمكتري أن يطالب بأي تسديد أو تخفيض.\nفي حالة انتهاء مدة العقد و عدم تمديده من طرف الشركة، يبقى المستأجر ملزما بتأدية غرامة جزافية مقدارها 100 درهم عن كل ساعة تأخير إلى حين استرجاع السيارة.\n\nالبند 6 : أوراق السيارة\nفي حالة فقدان وثائق السيارة، يبقى المستأجر هو المسؤول عن تكاليف إنجاز الوثائق و عن أيام توقف السيارة.\n\nالبند 7 : المسؤولية\nيبقى المستأجر المسؤول الوحيد عن الغرامات، المخالفات و كل المحاضر المحررة ضده من قبل السلطات المعنية.\nيبقى السائق مسؤولا ماليا عن الأضرار التي لحقت السيارة خلال مدة الكراء.\n-يلتزم المكتري بعدم التخلي عن السيارة مهما كانت أسباب توقفها.\n\nالبند 8 : سقوط حق المكتري\n-تسقط كافة حقوق المكتري الممنوحة له بمقتضى هذا العقد في حالة عدم احترامه لأي بند من هذا العقد مع المطالبة بأي تعويض عن المدة المتبقية.\n\nالبند 9: المنازعات\n-جميع المنازعات التي قد تنشأ بين شركة التأجير والمستأجر تبقى من الإختصاص الحصري للمحاكم التابعة لمقر الشركة.`
    }
  }),

  actions: {
    initializeFromStorage() {
      const stored = localStorage.getItem('appSettings')
      if (stored) {
        const parsed = JSON.parse(stored)
        this.tvaRate = parsed.tvaRate !== undefined ? parsed.tvaRate : 20
        if (parsed.alertThresholds) {
          this.alertThresholds = { ...this.alertThresholds, ...parsed.alertThresholds }
        }
        if (parsed.conditionsGenerales) {
          this.conditionsGenerales = { ...this.conditionsGenerales, ...parsed.conditionsGenerales }
        }
      }
    },

    updateSettings(settings) {
      if (settings.tvaRate !== undefined) {
        this.tvaRate = settings.tvaRate
      }
      if (settings.alertThresholds !== undefined) {
        this.alertThresholds = { ...this.alertThresholds, ...settings.alertThresholds }
      }
      if (settings.conditionsGenerales !== undefined) {
        this.conditionsGenerales = { ...this.conditionsGenerales, ...settings.conditionsGenerales }
      }
      this.saveSettings()
    },

    saveSettings() {
      localStorage.setItem('appSettings', JSON.stringify({
        tvaRate: this.tvaRate,
        alertThresholds: this.alertThresholds,
        conditionsGenerales: this.conditionsGenerales
      }))
    }
  }
})
